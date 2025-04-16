const { mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
const ApiError = require("../helpers/ApiError");
const STATUS_CODES = require("../helpers/status_code");
const cloudinary=require("../helpers/cloudinary");
const { response, generateToken } = require("../helpers/functions");
const streamifier=require('streamifier');
const {Notify}=require('../controller/Notifications');


/**
 * Searches users by username.
 * 
 * Returns up to 20 matching users with basic info and follow status.
 */
exports.searchUser = async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await UserModel.aggregate([
            { $match: { username: { $regex: username, $options: "i" } } }
            ,{$limit:20},
            { $addFields: { isFollowing: { $in: [req.user._id, "$followers"] } } },
            { $project: { name:1,username: 1, _id: 1, profilePicture: 1, isFollowing: 1 } }
        ]);

            response(res, "acknowledged", user||[])
    }
    catch (e) {
        next(e)
    }
}



/**
 * Fetches user info by ID.
 * 
 * Returns user details with follower stats and following status.
 */
exports.userInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const uid = new mongoose.Types.ObjectId(id);
        
        if (!mongoose.isValidObjectId(id)) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Uid not valid")
        
        

        const user = await UserModel.aggregate([
            { $match: { _id: uid } },
            {
                $addFields: {
                    followersCount: { $size: "$followers" },
                    followingCount: { $size: "$following" },
                    isFollowing: { $in: [new mongoose.Types.ObjectId(req.user._id), "$followers"] },
                    isRequested:{$in:[new mongoose.Types.ObjectId(req.user._id),"$requests"]}
                }
            }, {
                $project: {
                    followers: 0,
                    following: 0,
                    password: 0
                }
            }
        ]);

        
        if (!user.length)  throw new ApiError(STATUS_CODES.NOT_FOUND, "User Not Found")
        

        response(res,"acknowledged",user[0])
    } catch (e) {
        next(e);
    }
};



/**
 * Updates user profile details.
 * 
 * Checks for username conflict, updates profile, returns new token and data.
 */
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

exports.getrequests=async(req,res,next)=>{
    const requests=await UserModel.aggregate([
        {$match:{_id: new mongoose.Types.ObjectId(req.user._id)}},
        {$project:{requests:1}},
        {$lookup:{
            from :"users",
            localField:"requests",
            foreignField:"_id",
            as:"userRequests",
            pipeline:[{$project:{
                name:1,
                username:1,
                _id:1,
                profilePicture:1
            }}]
        }},{$project:{requests:0}}
    ])


    response(res,"acknowledged",requests[0]);
}

exports.requestActions=async(req,res,next)=>{
    const {action}=req.params;
    const {id}=req.query;
    if(action==='accept'){
        await UserModel.findByIdAndUpdate(req.user._id,{$push:{followers:id},$pull:{requests:id}});
        await UserModel.findByIdAndUpdate(id,{$push:{following:req.user._id}})
    }else{
        await UserModel.findByIdAndUpdate(req.user._id,{$pull:{requests:id}});
    }
    response(res,"acknowledged")
}
/**
 * Updates user's profile picture.
 * 
 * Uploads image to Cloudinary, saves URL to user profile, and returns the link.
 */
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



/**
 * Handles follow/unfollow interaction.
 * 
 * Updates follower and following lists, adds a follow notification if followed.
 */
exports.profileInteraction=async( req,res,next)=>{
    const {id}=req.params;
    const {action,acctype}=req.query;
    if(action==='follow'){
        if(acctype=='public'){
            await UserModel.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
        await UserModel.findByIdAndUpdate(req.user._id,{$push:{following:id}});
        Notify(id,"follow",null,req.user._id)
        response(res,"acknowledged");
        }else{
            await UserModel.findByIdAndUpdate(id,{$push:{requests:req.user._id}});
        response(res,"acknowledged");
        }
        
    }else if(action=='removeRequest'){
        await UserModel.findByIdAndUpdate(id,{$pull:{requests:req.user._id}});
    }else{
        await UserModel.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
        await UserModel.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
        response(res,"acknowledged");
    }
   
}


/**
 * Retrieves a paginated list of followers or following users for a given user ID.
 * 
 * Query Params:
 * - type: "followers" or "following" (default is "followers")
 * - page: Page number for pagination (default is 1)
 * 
 * Returns user details (_id, name, username, profilePicture) from the specified list.
 */
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




/**
 * Fetches notifications for the logged-in user.
 * 
 * Each notification includes:
 * - Type of notification (e.g., "follow")
 * - Associated contentId (if any)
 * - Associated contentType (if any)
 * - User details of the person who triggered the notification (username, profilePicture)
 * 
 * Results are sorted in descending order of creation time.
 */
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
          text:"$notifications.text",
          media:"$notifications.media"
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return response(res, "acknowledged", user);
  } catch (err) {
   next(err);
  }
};
