const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  type: { type: String, enum: ["group", "personal"], default:"personal" }, 
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users", index: true }], 
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }]
}, { timestamps: true });


ChatSchema.index({ users: 1 });

const ChatModel=mongoose.model('Chats',ChatSchema);


const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true }, 
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", default: null, index: true },
  text: { type: String, default: "" },
  type: { type: String, enum: ["user", "post"], default:"user" },
  mediaUrl: { type: String, default: null },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", default: null }, 
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
}, { timestamps: true });

MessageSchema.index({ chatboxId: 1, timestamp: -1 }); 
MessageSchema.index({ senderId: 1, timestamp: -1 });

const Message = mongoose.model("Messages", MessageSchema);

module.exports = {Message,ChatModel};