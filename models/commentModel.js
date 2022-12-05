const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide some text for the comment."],
      maxlength: [240, "Your comment is too long."]
    },
    postId: String,
    authorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post"
    },
    commentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      default: null
    },
    type: {
      type: String,
      enum: ["regular", "reply"],
      default: "regular"
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
);

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
