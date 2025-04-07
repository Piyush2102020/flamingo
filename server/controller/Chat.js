const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const { response } = require("../helpers/functions");


exports.LoadInbox = async (req, res, next) => {
    try {
      const chats = await UserModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req.user._id) }
        },
        {
          $project: { chats: 1 }
        },
        {
          $unwind: "$chats"
        },
        {
          $lookup: {
            from: "users",
            localField: "chats.userId",
            foreignField: "_id",
            as: "userInfo",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                  username: 1,
                  profilePicture: 1
                }
              }
            ]
          }
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "chats",
            localField: "chats.chatboxId",
            foreignField: "_id",
            as: "chatData"
          }
        },
        {
          $unwind: {
            path: "$chatData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "messages",
            let: { msgIds: "$chatData.messages" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$msgIds"] }
                }
              },
              { $sort: { createdAt: -1 } },
              { $limit: 10 } // You can adjust the limit per requirement
            ],
            as: "messages"
          }
        },
        {
          $project: {
            _id: 0,
            chats: {
              _id: "$chats._id",
              userId: "$chats.userId",
              chatboxId: "$chats.chatboxId",
              userInfo: "$userInfo",
              messages: "$messages"
            }
          }
        },
        {
          $group: {
            _id: req.user._id,
            chats: { $push: "$chats" }
          }
        }
      ]);
  
      response(res, "acknowledged", chats);
    } catch (e) {
      next(e);
    }
  };
  