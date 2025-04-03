const { default: mongoose } = require('mongoose');
const {response}=require('../helpers/functions');
const { ChatModel, Message } = require('../models/ChatModels');
const UserModel = require('../models/UserModel');
const {Notify}=require('../helpers/sockets');


exports.sendMessage=async(req,res,next)=>{

    try{

        let chatboxId=req.query.id;
        console.log("send Chatbox ID : ",chatboxId);
        
        const newMessage=new Message(req.body);
        await newMessage.save();
        if(chatboxId && mongoose.isValidObjectId(chatboxId)){
            await ChatModel.findByIdAndUpdate(chatboxId,{$push:{messages:newMessage._id}});
            Notify(req.body.receiverId,'message');
            response(res,"Chat Added Succesfully");
            return;

        }else{
            chatboxId=new ChatModel({users:[req.user._id,req.body.receiverId],messages:[newMessage._id]});
            await chatboxId.save();
            console.log("New Chatbox Id",chatboxId._id);
            await UserModel.findByIdAndUpdate(req.user._id, {
                $push: { chats: { userId: req.body.receiverId, chatboxId: chatboxId._id } }
            });
            
            await UserModel.findByIdAndUpdate(req.body.receiverId, {
                $push: { chats: { userId: req.user._id, chatboxId: chatboxId._id } }
            });            
            
        }

        Notify(req.body.receiverId,'message');
        response(res,"New Chatbox Created",chatboxId._id);


    }catch(e){
        next(e);
    }
  
}

exports.getChatId = async (req, res, next) => {
    try {
        const uid = req.query.id;

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

exports.getMessages=async (req,res,next)=>{

    const {id,page}=req.query;
    let limit=2;
    let currentPage=Number(page)||1;
    let skipCount=(currentPage-1)*limit;


    const messages=await ChatModel.aggregate(
        [
            {$match:{_id:new  mongoose.Types.ObjectId(id)}},
            {$lookup:{
                from:"messages",
                localField:"messages",
                foreignField:"_id",
                as:"messages",
                pipeline:[
                    {$sort:{createdAt:1}},
                    {$skip:skipCount},
                    {$limit:limit},
                    {$project:{
                        text:1,
                        receiverId:1
                    }}
                ]
            }},{$project:{createdAt:0,
                updatedAt:0,
                __v:0
            }}
        ]
    );
    
    if(messages){
        response(res,"acknowledged",(messages[0]).messages)
    }else{
response(res,"acknowleged")
    }
    
}


exports.getAllChat=async (req,res,next)=>{
    console.log("Getting Chats");
    
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
    console.log(UserChatBox);
    
    response(res,"acknowledged",UserChatBox[0])
}