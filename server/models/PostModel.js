const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, 
    content: { type: String,default:''}, 
    media: { type: String, default: null }, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [], index: true }], 
    tags: [{ type: String, default: [], index: true }], 
    visibility: { type: String, enum: ["public", "private", "friends"], default: "public", index: true } 
}, { 
    timestamps: true,
    toJSON: { virtuals: true },  
    toObject: { virtuals: true }
});

postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});


postSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        if (!options.includeLikes) {
            delete ret.likes;
        }
        return ret;
    }
});

module.exports = mongoose.model("Post", postSchema);
