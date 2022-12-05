const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Your post must contain an image!"]
    },
    authorId: String,
    description: String
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
