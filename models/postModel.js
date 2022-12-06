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
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    id: false
  }
);

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;
