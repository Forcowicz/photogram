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
    toJSON: true,
    toObject: true,
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
