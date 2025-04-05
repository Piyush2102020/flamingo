const { default: mongoose } = require('mongoose');
const {response}=require('../helpers/functions');
const { ChatModel, Message } = require('../models/ChatModels');
const UserModel = require('../models/UserModel');






exports.getChatId = async (req, res, next) => {
    try {
        const uid = req.query.id;
        console.log("Searching for : ",uid);
        

        const userChatBox = await UserModel.findById(req.user._id, { chats: 1 }).lean();

        if (!userChatBox || !userChatBox.chats) {
            return response(res, "no user found");
        }

        for (let element of userChatBox.chats) {
            if (element.userId.toString() === uid) { 
                return response(res, "acknowledged", element.chatboxId);
            }
        }

        return response(res, "no user found");
    } catch (error) {
        next(error);
    }
};



exports.getAllChat=async (req,res,next)=>{
   
    const UserChatBox=await UserModel.aggregate([
        {$match:{_id:new mongoose.Types.ObjectId(req.user._id)}},
        {$lookup:{
            from:"users",
            localField:"chats.userId",
            foreignField:"_id",
            as:"chats",
            pipeline:[{$project:{
                name:1,
                username:1,
                profilePicture:1,
                _id:1
            }},
                {$addFields:{chatboxId:"$chats.chatboxId"}}
            ]
        }}
    ]);
    
    
    response(res,"acknowledged",UserChatBox[0])
}


exports.loadChat=async(req,res,next)=>{
    const {id}=req.query;

    if(mongoose.isValidObjectId(id)){
        const chats=await ChatModel.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(id)}},{$lookup:{
                from:"messages",
                localField:"messages",
                foreignField:"_id",
                as:"messages",
                pipeline:[
                    {$project:{_id:1,
                        text:1
                    }}
                ]
    
            }}
        ]);
        if(chats.length>0){
            response(res,"acknowledged",(chats[0]).messages)
    
        }else{
            response(res,"acknowledged",[]);
        }
    
    }
    else{
        response(res,"acknowledged")
    }    
   
}

exports.addMessage=async(data)=>{
    const {newMessageNotify}=await require('../helpers/sockets');
    const newMessage=new Message({receiverId:data.receiverId,text:data.message});
    await newMessage.save()

    if(mongoose.isValidObjectId(data.chatboxId)){
        console.log("ADding to old chat",data.chatboxId);
        await ChatModel.findByIdAndUpdate(data.chatboxId,{$push:{messages:newMessage._id}});
        newMessageNotify(newMessage.toObject(),data.senderId,data.receiverId,data.chatboxId);
        return;
    }
    else{
        const newChatbox=new ChatModel({users:[data.senderId,data.receiverId],messages:[newMessage._id]});
        await newChatbox.save()
        await UserModel.findByIdAndUpdate(data.senderId,{$push:{chats:{userId:data.receiverId,chatboxId:newChatbox._id}}})
        await UserModel.findByIdAndUpdate(data.receiverId,{$push:{chats:{userId:data.senderId,chatboxId:newChatbox._id}}})
        newMessageNotify(newMessage.toObject(),data.senderId,data.receiverId,newChatbox._id);
        return;
    }
}