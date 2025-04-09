const mongoose = require('mongoose');


/**
 * Comment Model
 *
 * Defines the schema for storing comments and replies on posts.
 *
 * Fields:
 * - postId: ID of the post the comment belongs to (indexed)
 * - userId: ID of the user who made the comment
 * - content: text content of the comment
 * - parentId: optional ID of a parent comment for replies (null for top-level comments)
 * - likes: array of user IDs who liked the comment
 *
 * Includes automatic createdAt and updatedAt timestamps.
 */
const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
}, { timestamps: true });

const CommentModel= mongoose.model("Comments", commentSchema);
module.exports =CommentModel;
