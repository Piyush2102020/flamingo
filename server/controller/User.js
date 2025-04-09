const { mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
const ApiError = require("../helpers/ApiError");
const STATUS_CODES = require("../helpers/status_code");
const cloudinary=require("../helpers/cloudinary");
const { response, generateToken } = require("../helpers/functions");
const streamifier=require('streamifier');
const {Notify}=require('../helpers/sockets');

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

        
        if (!user.length) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, "User Not Found")
        }

        response(res,"acknowledged",user[0])
    } catch (e) {
        next(e);
    }
};




exports.updateProfile = async (req, res, next) => {
    try{
        const checkUsername=await UserModel.findOne({username:req.body.username},{username:1});
        if (checkUsername && checkUsername._id!=req.user._id)  throw new ApiError(STATUS_CODES.CONFLICT,"Username not available");
        const newData=(await UserModel.findByIdAndUpdate(req.user._id,{$set:req.body},{new:true})).toObject();
        delete newData.password;
        const jwtToken=await generateToken(newData);
        response(res,"acknowledged",{token:jwtToken,newData:newData});
    }   catch(e){
        next(e);
    }
};


exports.updateProfilePicture=async (req,res,next)=>{
    try{
        let link='';

        const upload_strean=cloudinary.uploader.upload_stream(
            {folder:"/flamingo/profile"},
            async(error,result)=>{
                if(error){
                    return next(error)
                }
                link=await result.secure_url;
                console.log("Link : ",link);
                await UserModel.findByIdAndUpdate(req.user._id,{$set:{profilePicture:link}});
                response(res,"acknowledged",{link:link})
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(upload_strean);

    }catch(e){
        next(e);
    }
}




exports.profileInteraction=async( req,res,next)=>{
    const {id}=req.params;
    const {action}=req.query;
    if(action==='follow'){
        const notification={type:"follow",contentId:null,userId:req.user._id};
        await UserModel.findByIdAndUpdate(id,{$push:{followers:req.user._id,notifications:notification}});
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
    const {type,page}=req.query;
    let matchField="followers";

    let limit=5;
    let currentPage=Number(page)||1;
    let skipCount=(currentPage-1)*limit;
    if(type=='followers'){
        matchField="followers";
    }else{
        matchField="following";
    }

    console.log("Page : ",page);
    
    const users=await UserModel.aggregate([
        {$match:{_id:new mongoose.Types.ObjectId(id)}},
        {$project:{[matchField]:1}},
        {$lookup:{
            from:"users",
            localField:matchField,
            foreignField:"_id",
            as:matchField,
            pipeline:[
                {$skip:skipCount},
                {$limit:limit},{
                    $project:{
                    _id:1,
                    name:1,
                    username:1,
                    profilePicture:1
                }}
            ]
        }}
    ]);
    if(users){
        response(res,"acknowledged",(users[0])[matchField]);
    }else{
        response(res,"acknowledged")
    } 
}

exports.Notifications = async (req, res, next) => {
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $project: {
          notifications: 1,
        },
      },
      {
        $unwind: "$notifications",
      },
      {
        $lookup: {
          from: "users",
          localField: "notifications.userId",
          foreignField: "_id",
          as: "userData",
          pipeline: [
            {
              $project: {
                username: 1,
                profilePicture: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          _id: 0,
          type: "$notifications.type",
          contentId: "$notifications.contentId",
          contentType: "$notifications.contentType",
          userData: "$userData",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return response(res, "acknowledged", user);
  } catch (err) {
    console.error(err);
    return response(res, "error", null);
  }
};
