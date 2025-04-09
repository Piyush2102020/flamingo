const mongoose = require("mongoose");


/**
 * User Model
 * 
 * Represents a user in the system with profile, authentication, and social graph details.
 *
 * Fields:
 * - name, username, email, password: basic account and auth info
 * - profilePicture, bio, links, dob: profile customization
 * - accountVisibility: public or private profile
 * - messageAllowed: who can message the user (default: Everyone)
 * - followers/following: arrays of User references for social networking
 * - postCount: number of posts user has made
 * - chats: stores chat metadata { userId, chatboxId }
 * - resetPasswordToken & resetPasswordExpire: for password recovery
 * - gender: user gender ("male", "female", or "not-specified")
 * - notifications: embedded documents using NotificationSchema
 *
 * NotificationSchema:
 * - type: the kind of notification (e.g., "like", "follow")
 * - contentId: the ID of the related content (e.g., post ID)
 * - userId: user who triggered the notification
 * - contentType: type of content involved (default: "post")
 *
 * Indexes:
 * - email, username: for uniqueness
 * - userId in notifications: for efficient user-notification lookup
 * - chats.userId: for efficient chat retrieval
 *
 * Adds timestamps: createdAt, updatedAt
 */
const NotificationSchema=new mongoose.Schema(
    {
        type:{type:String,required:true},
        contentId:{type:String},
        userId:{type:mongoose.Types.ObjectId,required:true,index:true},
        contentType:{type:"String",default:"post"}
    }
)



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
    notifications:[NotificationSchema]
}, { timestamps: true });

userSchema.index({ "chats.userId": 1 });
const UserModel= mongoose.model("User", userSchema);

module.exports =UserModel;