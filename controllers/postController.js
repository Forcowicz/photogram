const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/AppError");
const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createOne = catchAsync(async (req, res, next) => {
  const data = {
    description: req.body.description,
    authorId: req.user._id,
    imageUrl: req.body.imageUrl
  };

  const post = await Post.create(data);

  res.status(201).json({
    status: "success",
    data: {
      post
    }
  });
});

exports.savePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, `Couldn't find post with this ID: ${postId}`));

  await User.findByIdAndUpdate(req.user._id, { $push: { savedPosts: postId } });

  res.status(200).json({
    status: "success",
    message: "Post has been saved to your collection.",
    data: {
      post
    }
  });
});

// TODO: Make sure user can't save the same post twice

exports.unsavePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  await User.findByIdAndUpdate(req.user._id, { $pull: { savedPosts: postId } });

  res.status(200).json({
    status: "success",
    message: "Post has been removed from your collection."
  });
});

exports.getAll = handlerFactory.getAll(Post);
exports.getOne = handlerFactory.getOne(Post);
// exports.createOne = handlerFactory.createOne(Post);
exports.deleteOne = handlerFactory.deleteOne(Post);
exports.updateOne = handlerFactory.updateOne(Post, ["description"]);
