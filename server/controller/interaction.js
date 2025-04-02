const ApiError = require("../helpers/ApiError");
const { response } = require("../helpers/functions");
const STATUS_CODES = require("../helpers/status_code");
const PostModel = require("../models/PostModel");

exports.Interact=async(req,res,next)=>{

    try{

        const {id}=req.params;
        const {type}=req.query;


        if(!id || !type){
            throw new ApiError(STATUS_CODES.CONFLICT,"There was an error");
        }
        else{
            if(type=='like'){
                await PostModel.findByIdAndUpdate(id,{$push:{likes:req.user._id}});
                
            }else if(type=='dislike'){
                await PostModel.findByIdAndUpdate(id,{$pull:{likes:req.user._id}});
            }
            else if(type=='save'){

            }else if(type=='remove'){
                
            }
            response(res,"Interacted") 
        }
    }catch(e){
        next(e);
    }
}