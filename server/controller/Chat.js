const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const { response } = require("../helpers/functions");
const { Message, ChatModel } = require('../models/ChatModels');





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
      { $unwind: "$chats" },

      {
        $lookup: {
          from: "users",
          localField: "chats.userId",
          foreignField: "_id",
          as: "userData",
          pipeline: [
            {
              $project: {
                username: 1,
                name: 1,
                profilePicture: 1,
              },
            },
          ],
        },
      },

      {
        $lookup: {
          from: "chats",
          localField: "chats.chatboxId",
          foreignField: "_id",
          as: "chatDetails",
          pipeline: [
            {
              $project: {
                lastMessage: 1,
              },
            },
          ],
        },
      },

      {
        $lookup: {
          from: "messages",
          localField: "chatDetails.0.lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },

      {
        $project: {
          userId: "$chats.userId",
          chatboxId: "$chats.chatboxId",
          userData: { $arrayElemAt: ["$userData", 0] },
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        },
      },
      {$sort:{"lastMessage.createdAt":-1}}
    ]);

    response(res, "acknowledged", chats);
  } catch (e) {
    next(e);
  }
};


/**
 * Used in the socket to add a message and emit it realtime to the corresponding user
 */
exports.addMessage = async (data) => {
  const { getIoStream, getUserSocketId } = require('../helpers/sockets');
  const io = getIoStream();
  const newMessage = new Message(data);
  await newMessage.save();
  console.log(data);

  if (mongoose.isValidObjectId(data.chatboxId)) {
    await ChatModel.findByIdAndUpdate(data.chatboxId,{ $push: { messages: newMessage._id },$set:{
      lastMessage:newMessage._id
    } });
  } else {
    console.log("Creating new chat : ");

    const newChatbox = new ChatModel({
      users: [data.senderId, data.receiverId],
      messages: [newMessage._id],
      lastMessage:newMessage._id
    });
    await newChatbox.save()
    await UserModel.findByIdAndUpdate(data.senderId, { $push: { chats: { userId: data.receiverId, chatboxId: newChatbox._id } } })
    await UserModel.findByIdAndUpdate(data.receiverId, { $push: { chats: { userId: data.senderId, chatboxId: newChatbox._id } } })
    data.chatboxId = newChatbox._id;
  }


  if (io) {
    const senderSocket = getUserSocketId(data.senderId);
    const receiverSocket = getUserSocketId(data.receiverId);
    const dataItem = { data: newMessage, chatboxId: data.chatboxId };
    if (senderSocket) io.to(senderSocket).emit('newMessage', dataItem
    );
    if (receiverSocket) io.to(receiverSocket).emit('newMessage', dataItem);
  }
}


/**
 * Used to load all the messages in a particular chatbox (Lazy loading not applied now)
 */
exports.getOldMessage = async (req, res, next) => {
  try {
    const Messages = await ChatModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.chatboxid) } },
      {
        $project: {
          messages: 1,
          _id: 0
        }
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages"
        }
      }, { $project: { messages: 1 } }
    ])

    response(res, "acknowledged", Messages[0]?.messages || []);
  } catch (e) {
    next(e);
  }
}