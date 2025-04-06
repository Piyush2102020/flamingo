const { response } = require("../helpers/functions");
const { MusicModel } = require("../models/MusicModel")

exports.SearchMusic=async (req,res,next)=>{
    
    const musicPath=await MusicModel.find();

    response(res,"acknowledged",musicPath)
}