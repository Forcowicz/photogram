const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Your post must contain an image!"]
    },
    authorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    description: {
      type: String,
      maxlength: [280, "Post description is too long!"]
    },
    archived: {
      type: Boolean,
      default: false
    },
    likes: {
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
  return this.likes?.length;
});

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;
