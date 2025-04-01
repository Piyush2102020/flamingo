const { default: mongoose } = require('mongoose');
const {response}=require('../helpers/functions');
const { ChatModel, Message } = require('../models/ChatModels');
const UserModel = require('../models/UserModel');

exports.Chat = async (req, res, next) => {
    try {
        const { chatboxId, receiverId, text } = req.body;
        console.log(req.body);
        let chat;

        if(mongoose.isValidObjectId(chatboxId)){
            chat = await ChatModel.findById(chatboxId);
        }
        let senderId=req.user._id;
        const newMessage = new Message({ senderId:req.user._id, receiverId,text });

        await newMessage.save();

        if (chat) {
            await ChatModel.findByIdAndUpdate(chatboxId, { 
                $push: { messages: newMessage._id } 
            });
        } else {
            chat = new ChatModel({
                users: [senderId, receiverId],
                messages: [newMessage._id]
            });
            await chat.save();
        }

        await UserModel.updateMany(
            { _id: { $in: [req.user._id, receiverId] } }, 
            { $set: { chats: chat._id } }            
        );
          response(res,"message sent",chat._id);

    } catch (e) {
        next(e);
    }
};



exports.RetreiveChat=async(req,res,next)=>{
    let limit=10;
    const {chatboxId,page}=req.query;
    console.log(chatboxId);
    
    const currentPage=Number(page)||1;
    const skip=(currentPage-1)*limit;
    if(mongoose.isValidObjectId(chatboxId)){
        const chat=await ChatModel.aggregate(
            [
                {$match:{_id:new mongoose.Types.ObjectId(chatboxId)}},
                {$lookup:{
                    from:"messages",
                    localField:"messages",
                    foreignField:"_id",
                    as:"messages",
                    pipeline:[
                        {$sort:{createdAt:-1}},
                        {$skip:skip},
                        {$limit:limit},
                        {$project:{
                            updatedAt:0,
                            __v:0,timestamp:0
                        }}
                    ]
                }},
                {$project:{
                    users:0
                }}
            ]
        )
        console.log("For page sending chat : ",chat[0]);
        
        response(res,"acknowledged",chat[0].messages)
    
    }
    else{
        response(res,"Invalid chatbox id")
    }
}


exports.GetChatBoxes=async (req,res,next)=>{
    const chatboxes=await UserModel.aggregate(
        [
            {$match:{_id:new mongoose.Types.ObjectId(req.user._id)}},
            {$project:{chats:1}},
            {$lookup:{
                from:"chats",
                localField:"chats",
                foreignField:"_id",
                as:"chatBoxItems",
                pipeline:[
                    {$project:{
                        _id:1,
                        users:1,
                    }},
                    {$lookup:{
                        from:"users",
                        localField:"users",
                        foreignField:"_id",
                        as:"userData",
                        pipeline:[{
                            $project:{
                                username:1,
                                name:1,
                                _id:1,
                                profilePicture:1
                            }}
                        ]
                    }},{$project:{
                        userData:{$filter:{
                            input:"$userData",
                            as:"user",
                            cond:{$ne:["$$user._id",new mongoose.Types.ObjectId(req.user._id)]}
                        }}
                    }},
                    {$unwind:"$userData"}
                ]
            }},
            {$project:{chatBoxItems:1}}
        ]
    )

    response(res,"acknowledged",chatboxes[0])
}