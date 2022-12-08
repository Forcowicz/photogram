const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/AppError");
const Post = require("../models/postModel");
const User = require("../models/userModel");

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

exports.likePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, "This post doesn't exist."));

  post.likes.push(userId);
  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "You liked this post."
  });
});

exports.dislikePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;

  await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

  res.status(200).json({
    status: "success",
    message: "You disliked this post."
  });
});

exports.getAll = handlerFactory.getAll(Post, { populate: { path: "authorId", select: "username _id email" } });
exports.getOne = handlerFactory.getOne(Post);
exports.createOne = handlerFactory.createOne(Post, {
  allowedFields: ["description", "imageUrl"],
  authorField: "authorId"
});
exports.deleteOne = handlerFactory.deleteOne(Post);
exports.updateOne = handlerFactory.updateOne(Post, { allowedFields: ["description"] });
