const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const { response } = require("../helpers/functions");
const { Message, ChatModel }=require('../models/ChatModels');





/**
 * Load all the messages in the users inbox returns a list of userdata with their corresponding chatboxId's
 */
exports.getUsersInInbox = async (req, res, next) => {
  try {


    const chats = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $project: {
          chats: 1,
          _id: 0,
        },
      },
      {
        $unwind: "$chats",
      },
      {
        $lookup: {
          from: "users",
          localField: "chats.userId",
          foreignField: "_id",
          as: "chats.userData",
          pipeline: [
            {
              $project: {
                name: 1,
                username: 1,
                profilePicture: 1,
                _id: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$chats.userData",
      },
      {
        $project: {
          userId: "$chats.userId",
          chatboxId: "$chats.chatboxId",
          userData: "$chats.userData",
        },
      },
    ]);
    console.log(chats);
    response(res, "acknowledged", chats || []);
  } catch (e) {
    next(e);
  }
};



/**
 * Used in the socket to add a message and emit it realtime to the corresponding user
 */
exports.addMessage=async(data)=>{
  const {getIoStream,getUserSocketId}=require('../helpers/sockets');
  const io=getIoStream();
  const newMessage=new Message(data);
  await newMessage.save();
  console.log(data);
  
  if(mongoose.isValidObjectId(data.chatboxId)){
  
    await ChatModel.findByIdAndUpdate(data.chatboxId,{$push:{messages:newMessage._id}});
  }else{
    console.log("Creating new chat : ");
    
    const newChatbox=new ChatModel({
      users:[data.senderId,data.receiverId],
      messages:[newMessage._id]
    });
    await newChatbox.save()
    await UserModel.findByIdAndUpdate(data.senderId,{$push:{chats:{userId:data.receiverId,chatboxId:newChatbox._id}}})
    await UserModel.findByIdAndUpdate(data.receiverId,{$push:{chats:{userId:data.senderId,chatboxId:newChatbox._id}}})
    data.chatboxId=newChatbox._id;
  }
  

  if(io){
    const senderSocket=getUserSocketId(data.senderId);
    const receiverSocket=getUserSocketId(data.receiverId);
    const dataItem={data:newMessage,chatboxId:data.chatboxId};
    if(senderSocket)io.to(senderSocket).emit('newMessage',dataItem
      );
    if(receiverSocket) io.to(receiverSocket).emit('newMessage',dataItem);
  }
}


/**
 * Used to load all the messages in a particular chatbox (Lazy loading not applied now)
 */
exports.getOldMessage=async(req,res,next)=>{
  try{
    const Messages=await ChatModel.aggregate([
      {$match:{_id:new mongoose.Types.ObjectId(req.params.chatboxid)}},
      {$project:{
        messages:1,
        _id:0
      }},
      {
        $lookup:{
          from:"messages",
          localField:"messages",
          foreignField:"_id",
          as:"messages"
        }
      },{$project:{messages:1}}
    ])

    response(res,"acknowledged",Messages[0]?.messages||[]);
  }catch(e){
    next(e);
  }
}