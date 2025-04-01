const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    username: { type: String, unique: true, default: "" ,index:true},
    email: { type: String, required: true, unique: true ,index:true},
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    postCount:{type:Number,default:0},
    chats:[{type:mongoose.Types.ObjectId,default:[],ref:"Chats"}]
}, { timestamps: true });


userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });


module.exports = mongoose.model("User", userSchema);
