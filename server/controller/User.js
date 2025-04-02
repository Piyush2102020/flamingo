const { mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
const ApiError = require("../helpers/ApiError");
const STATUS_CODES = require("../helpers/status_code");
const cloudinary=require("../helpers/cloudinary");
const { response } = require("../helpers/functions");
const streamifier=require('streamifier');


exports.searchUser = async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await UserModel.aggregate([
            { $match: { username: { $regex: username, $options: "i" } } }
            ,{$limit:20},
            { $addFields: { isFollowing: { $in: [req.user._id, "$followers"] } } },
            { $project: { name:1,username: 1, _id: 1, profilePicture: 1, isFollowing: 1 } }
        ]);

        if (user) {
            response(res, "acknowledged", user)
        } else {
            throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
        }
    }
    catch (e) {
        next(e)
    }
}


exports.userInfo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, "Uid not valid")
        }
        const uid = new mongoose.Types.ObjectId(id);

        const user = await UserModel.aggregate([
            { $match: { _id: uid } },
            {
                $addFields: {
                    followersCount: { $size: "$followers" },
                    followingCount: { $size: "$following" },
                    isFollowing: { $in: [new mongoose.Types.ObjectId(req.user._id), "$followers"] }
                }
            }, {
                $project: {
                    followers: 0,
                    following: 0,
                    password: 0
                }
            }
        ]);

        console.log("User : ",user);
        
        if (!user.length) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, "User Not Found")
        }

        response(res,"acknowledged",user[0])
    } catch (e) {
        next(e);
    }
};




exports.updateProfile = async (req, res, next) => {
    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl = await new Promise((resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    { folder: "flamingo/dp" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
            });
        }

        const updateData = {};
        Object.keys(req.body).forEach((key) => {
            if (req.body[key]) updateData[key] = req.body[key]; 
        });

        if (imageUrl) updateData.profilePicture = imageUrl;

        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });

        return res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });

    } catch (e) {
        console.error("Error updating profile:", e);
        return res.status(500).json({ message: "Something went wrong!" });
    }
};




exports.profileInteraction=async( req,res,next)=>{
    const {id}=req.params;
    const {action}=req.query;
    console.log(action);
    
    if(action==='follow'){
        await UserModel.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
        await UserModel.findByIdAndUpdate(req.user._id,{$push:{following:id}});
        response(res,"acknowledged");
    }else{
        await UserModel.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
        await UserModel.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
        response(res,"acknowledged");
    }
   
}


exports.getAccData=async(req,res,next)=>{
    const {id}=req.params;
    const {type}=req.query;
    let matchField="followers";
    if(type=='followers'){
        matchField="followers";
    }else{
        matchField="following";
    }


    const users=await UserModel.aggregate([
        {$match:{_id:new mongoose.Types.ObjectId(id)}},
        {$project:{[matchField]:1}},
        {$lookup:{
            from:"users",
            localField:matchField,
            foreignField:"_id",
            as:matchField,
            pipeline:[
                {$project:{
                    _id:1,
                    name:1,
                    username:1,
                    profilePicture:1
                }}
            ]
        }}
    ]);
    if(users){
        response(res,"acknowledged",users[0]);
    }else{
        response(res,"acknowledged",[])
    }

  
}