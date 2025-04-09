const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');



/**
 * Auth & Response Utility Module
 * 
 * Provides utility functions for:
 * - Sending standardized JSON responses (`response`)
 * - Password hashing and comparison (`hashPassword`, `matchPassword`)
 * - JWT token generation and validation (`generateToken`, `validateToken`)
 */


exports.response=(res,message,data)=>{
    res.status(200).json(
        {
            success:true,
            message:message,
            ...(data&& {data:data} ) 
        }
    )
}

exports.hashPassword=(password)=>{
    return bcrypt.hash(password,10);
}

exports.matchPassword=(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}


exports.generateToken=(data)=>{
    return jwt.sign(data,process.env.JWT_SECRET,{expiresIn:'24h'});
}


exports.validateToken=(token)=>{
    return jwt.verify(token,process.env.JWT_SECRET);
}