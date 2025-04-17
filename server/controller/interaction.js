const { default: mongoose } = require("mongoose");
const ApiError = require("../helpers/ApiError");
const { response } = require("../helpers/functions");
const STATUS_CODES = require("../helpers/status_code");
const PostModel = require("../models/PostModel");
const { Notify } = require("./Notifications");


/**
 * Takes in the post id and type is it like dislike etc and do the following actions
 */
exports.Interaction=async(req,res,next)=>{
    console.log("liked called");
    try{
       
        
        const {id}=req.params;
        const {type}=req.query;
        if(!id || !type){
            throw new ApiError(STATUS_CODES.CONFLICT,"There was an error");
        }
        else{
            if(type=='like'){
                const postData=await PostModel.findByIdAndUpdate(id,{$push:{likes:req.user._id}},{new:true});
                Notify(postData.userId,"liked",id,req.user._id,"post",postData.media,text="");
            }else if(type=='dislike'){
                await PostModel.findByIdAndUpdate(id,{$pull:{likes:req.user._id}});
            }
            else if(type=='save'){

            }else if(type=='remove'){
                
            }else{
                await PostModel.findByIdAndUpdate(id,{$push:{reports:req.user._id}});
            }
            response(res,"Interacted") 
        }
    }catch(e){
        next(e);
    }
}



exports.PostFunctions=async(req,res,next)=>{
    try{
        const {id}=req.params;

        const post=await PostModel.findOne({_id:new mongoose.Types.ObjectId(id)});
        if(post.userId.toString()===req.user._id){
           await post.deleteOne();
           response(res,"acknowledged");
        }else{
            throw new ApiError(STATUS_CODES.FORBIDDEN,"Action Prohibited");
        }
    }catch(e){
next(e);
    }
}