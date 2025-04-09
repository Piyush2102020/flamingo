const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const { response } = require("../helpers/functions");
const { getIoStream, getUserSocketId } = require("../helpers/sockets");





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

    response(res, "acknowledged", chats || []);
  } catch (e) {
    next(e);
  }
};



exports.addMessage=async(data)=>{
  const {getIoStream,getUserSocketId}=require('../helpers/sockets');
  console.log("Message : ",data);
  const io=getIoStream();
  if(io){
    const senderSocket=getUserSocketId(data.senderId);
    const receiverSocket=getUserSocketId(data.receiverId);
    console.log(senderSocket,receiverSocket);
    if(senderSocket)io.to(senderSocket).emit('newMessage',data);
    if(receiverSocket) io.to(receiverSocket).emit('newMessage',data);
  }
}