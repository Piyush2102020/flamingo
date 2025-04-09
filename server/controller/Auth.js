const mongoose = require('mongoose');
const UserModel = require('../models/UserModel');
const ApiError = require('../helpers/ApiError');
const STATUS_CODES = require('../helpers/status_code');
const { hashPassword, response, generateToken, matchPassword} = require('../helpers/functions');
const {eventEmitter}=require('../helpers/email');
const crypto=require('crypto');




/**
 * Handles user authentication and registration.
 * 
 * Supports 'create' for signing up and 'login' for user authentication.
 * Generates and returns a JWT token on success.
 * Adds follower/following counts and filters sensitive fields in response.
 */

exports.Auth = async (req, res, next) => {    


    try {
        const {type}=req.params;
        const {  email, username, password } = req.body;

        if (!type || !["create", "login"].includes(type))return next(new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid request type"));

        const filtered= await UserModel.aggregate([{$match:{ 
            $or: [{ email }, { username }] 
        }},
        {$addFields:{
            followersCount:{$size:"$followers"},
            followingCount:{$size:"$following"},
        }},
        {$project:{
            posts:0,
            followers:0,
            following:0
        }}
    ]);



    const isAvailable=filtered.length>0?filtered[0]:null;
        if (type === "create") {
            if (isAvailable) {
                const errorMessage = isAvailable.email === email ? 
                    "Email already in use" : 
                    "Username not available";
                throw new ApiError(STATUS_CODES.CONFLICT, errorMessage);
            }
            req.body.password = await hashPassword(password);
            const newUser = new UserModel(req.body);
            await newUser.save();
            const token = await generateToken(newUser.toObject());
            return response(res, "Account created successfully", { token });
        }

        if (type === "login") {
            if (!isAvailable) return next(new ApiError(STATUS_CODES.NOT_FOUND, "User not found"));

            const passMatched = await matchPassword(password, isAvailable.password);

            if (!passMatched) return next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Username or Password Incorrect"));

            const data = isAvailable;
            delete data.password;
            const token = await generateToken(data);

            return response(res, "Login Success", { token });
        }

    } catch (e) {
        next(e);
    }
};



/**
 * Initiates password reset for a user.
 * 
 * Generates a reset token and expiration, saves it to the user record,
 * and emits an event to send the reset link to the user's email.
 */

exports.resetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) return response(res, "Email is not registered");
        
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = Date.now() + 3600000; 

  
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpire;
        await user.save();

        const resetLink = `http://${process.env.DB_URL}/auth/forgetpassword?token=${resetToken}`;

        await eventEmitter.emit('reset',email,resetLink);

        return response(res, "Please check your email for further instructions");

    } catch (e) {
        next(e);
    }
};



/**
 * Changes the user's password using a valid reset token.
 * 
 * Verifies the token, updates the password with a hashed version,
 * clears the reset token fields, and saves the user record.
 */

exports.ChangePassword=async(req,res,next)=>{

    try{
        const {token,password}=req.body;
        const user=await UserModel.findOne({resetPasswordToken:token});
    
        if(user){
            user.resetPasswordToken=null;
            user.resetPasswordExpire=null;
            const newHashPassword=await hashPassword(password);
            user.password=newHashPassword;
            await user.save();

            response(res,"Your password is changed please login");
        }
        else{
            throw new ApiError(STATUS_CODES.BAD_REQUEST,"Token Expired");
        }
    }catch(e){
        next(e);
    }
   
}