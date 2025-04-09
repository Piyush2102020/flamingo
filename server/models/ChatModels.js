const mongoose = require("mongoose");



/**
 * Chat and Message Models
 *
 * Defines Mongoose schemas and models for chat and messaging functionalities.
 *
 * ChatSchema:
 * - type: 'group' or 'personal' (default: personal)
 * - users: array of user ObjectIds involved in the chat
 * - messages: array of message ObjectIds belonging to the chat
 *
 * MessageSchema:
 * - receiverId: recipient user ObjectId (indexed)
 * - senderId: sender user ObjectId (indexed)
 * - text: message content (optional)
 * - type: 'user' or 'post' (default: user)
 * - mediaUrl: optional URL for media files
 * - postId: optional reference to a related post
 * - status: message status ('sent', 'delivered', 'read')
 *
 * Both schemas include timestamps for createdAt and updatedAt.
 */
const ChatSchema = new mongoose.Schema({
  type: { type: String, enum: ["group", "personal"], default: "personal" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], 
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }]
}, { timestamps: true });

ChatSchema.index({ users: 1 });



const MessageSchema = new mongoose.Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },
  text: { type: String, default: "" },
  type: { type: String, enum: ["user", "post"], default: "user" },
  mediaUrl: { type: String, default: null },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", default: null },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
}, { timestamps: true });



const ChatModel = mongoose.model("Chats", ChatSchema);
const Message = mongoose.model("Messages", MessageSchema);

module.exports = { Message, ChatModel };