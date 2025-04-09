const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  type: { type: String, enum: ["group", "personal"], default: "personal" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], 
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }]
}, { timestamps: true });

ChatSchema.index({ users: 1 });

const ChatModel = mongoose.model("Chats", ChatSchema);

const MessageSchema = new mongoose.Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },
  text: { type: String, default: "" },
  type: { type: String, enum: ["user", "post"], default: "user" },
  mediaUrl: { type: String, default: null },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", default: null },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
}, { timestamps: true });


const Message = mongoose.model("Messages", MessageSchema);

module.exports = { Message, ChatModel };