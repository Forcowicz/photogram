const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: [String],
      required: [true, "Your post must contain an image!"]
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    description: {
      type: String,
      maxlength: [2048, "Post description is too long!"]
    },
    archived: {
      type: Boolean,
      default: false
    },
    comments: {
      type: [mongoose.Schema.ObjectId],
      ref: "Comment"
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: "User"
      // select: false
    },
    tagged: {
      type: [mongoose.Schema.ObjectId],
      ref: "User"
      // select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// Virtuals

postSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

postSchema.virtual("taggedCount").get(function () {
  return this.tagged?.length || 0;
});

postSchema.virtual("commentCount").get(function () {
  return this.comments?.length || 0;
});

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;
