const cloudinary = require('../helpers/cloudinary');
const { response } = require('../helpers/functions');
const streamifier = require('streamifier');
const PostModel = require('../models/PostModel');
const ApiError = require('../helpers/ApiError');
const STATUS_CODES = require('../helpers/status_code');
const { default: mongoose } = require('mongoose');
const CommentModel = require('../models/CommentModel');
const UserModel = require('../models/UserModel');

exports.MakePost = async (req, res, next) => {
    try {
        let mediaUrl = '';

        if (req.file) {

            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "/flamingo_posts" },
                async (error, result) => {
                    if (error) {
                        return next(error);
                    }

                    mediaUrl = result.secure_url;

                    const newPost = new PostModel({
                        userId: req.user._id,
                        media: mediaUrl,
                        ...req.body
                    });

                    await newPost.save();
                    response(res, "Post Created");
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
    
            const newPost = new PostModel({
                userId: req.user._id,
                ...req.body
            });

            await newPost.save();
            await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(req.user._id),{$inc:{postCount:1}});
            response(res, "Post Created");
        }
    } catch (e) {
        next(e);
    }
};


exports.RetrievePost = async (req, res, next) => {
    try {
        let limit = 2;
        const { page = 1, uid, type } = req.query;
       
        let filter = {};
        if (type === 'feed' && !uid) {
            filter = {};
        } else if (type === 'user' && uid) {
            filter = { userId: new mongoose.Types.ObjectId(uid) };
        } else {
            throw new ApiError(405, "Method Not Allowed");
        }
    

        const posts = await PostModel.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: (Number(page) - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                    pipeline: [{
                        $project: {
                            username: 1,
                            name: 1,
                            _id: 1,
                            profilePicture: 1
                        }
                    }]
                }
            }, { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } }, 
            { $addFields: { likesCount: { $size: "$likes" },
            isLiked: { $in: [new mongoose.Types.ObjectId(req.user._id), "$likes"] }  } },
            { $project: { likes: 0, comments: 0, updatedAt: 0, __v: 0,userId:0} }
        ]);

      
        response(res, "acknowledged", posts);
    }
    catch (e) {
        next(e);
    }
};



exports.AddComment = async (req, res, next) => {
    try {
        const { postId, parentId } = req.params;
        const newComment = new CommentModel({ postId: postId, parentId: parentId, userId: req.user._id, content: req.body.content });
        await newComment.save()
        response(res,"acknowledged")

    } catch (e) {
        next(e);
    }
}




exports.GetComments = async (req, res, next) => {
    console.log("Get comments triggered");
    
    const { postId, parentId } = req.params;
    
    const currentPage = Number(req.query.page) || 1;
    console.log(postId,parentId,currentPage);
    
    let limit = 20;
    let skipCount = (currentPage - 1) * limit;
    let filter = { $match: { $and: [{ postId:new mongoose.Types.ObjectId( postId )},{parentId:null}] } }
    try {
        if(parentId){
            if(mongoose.isValidObjectId(parentId)){
                filter = { $match: { $and: [{ postId:new mongoose.Types.ObjectId( postId )}, 
                    { parentId:new mongoose.Types.ObjectId( parentId)}] } }         
            }
        }

        const comments = await CommentModel.aggregate([
            filter,
            { $sort: { createdAt: -1 } },
            { $skip: skipCount },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                    pipeline: [{
                        $project: {
                            _id: 1,
                            username: 1,
                            name: 1,
                            profilePicture: 1
                        }
                    }]
                }
            },{$unwind:{path:"$userData"}},
            {$addFields:{likesCount:{$size:"$likes"}}},
            {$project:{
                updatedAt:0,
                __v:0,
                likes:0
            }}
        ])


            response(res,"acknowledged",comments);
  


    } catch (e) {
        next(e);
    }

}