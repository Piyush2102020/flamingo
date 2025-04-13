const mongoose = require('mongoose');


/**
 * Post Model
 *
 * Defines the schema for user posts.
 *
 * Fields:
 * - userId: ID of the user who created the post (indexed)
 * - content: text content of the post
 * - media: optional media URL associated with the post
 * - likes: array of user IDs who liked the post (indexed)
 * - tags: array of category or topic tags for discovery (indexed)
 * - visibility: who can see the post — public, private, or friends (indexed)
 *
 * Virtuals:
 * - likeCount: dynamically calculates the number of likes
 *
 * Custom JSON Serialization:
 * - Excludes `likes` field by default unless `includeLikes` option is true.
 *
 * Automatically adds createdAt and updatedAt timestamps.
 */
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, 
    content: { type: String,default:''}, 
    media: { type: String, default: null }, 
    mediaType:{type:String,default:"image"},
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
