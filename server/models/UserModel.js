const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ["like", "comment", "follow", "message", "system"], 
        required: true 
    }, 

    referenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: "referenceModel" 
    }, 

    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    username: { type: String, unique: true, default: "", index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    bio:{type:String,default:""},
    links:{type:String,default:null},
    dob:{type:Date,default:Date.now()},
    accountVisibility:{type:String,enum:["public","private"],default:"public"},
    messageAllowed:{type:String,default:"Everyone"},
    followers: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    postCount: { type: Number, default: 0 },
    chats: [{ userId: { type: mongoose.Types.ObjectId, ref: "User" }, chatboxId: { type: mongoose.Types.ObjectId, ref: "Chats" } }],
    resetPasswordToken:{type:String,default:null},
    resetPasswordExpire:{type:Date,default:null},
    gender:{type:String,default:"not-specified",enum:["male","female","not-specified"]},
    notifications:[notificationSchema]
}, { timestamps: true });

userSchema.index({ "chats.userId": 1 });
const UserModel= mongoose.model("User", userSchema);

module.exports =UserModel;