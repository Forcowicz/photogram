const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide some text for the comment."],
      maxlength: [240, "Your comment is too long."]
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: "User"
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post"
    },
    authorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }
    // commentId: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Comment",
    //   validate: {
    //     validator: function (val) {
    //       return val && this.type === "reply";
    //     },
    //     message: "This comment is not a reply, you cannot reference another comment here."
    //   }
    // },
    // type: {
    //   type: String,
    //   enum: ["regular", "reply"],
    //   default: "regular",
    //   validate: {
    //     validator: function () {
    //       return this.commentId !== undefined;
    //     },
    //     message: "Please provide comment ID reference."
    //   }
    // }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
);

// Virtuals

commentSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

// TODO: Check if referenced comments exist

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
