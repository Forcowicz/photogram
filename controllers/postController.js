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

exports.saveOrUnsavePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, `Couldn't find post with this ID: ${postId}`));

  const user = await User.findById(req.user._id);

  let message;

  if (user.savedPosts.includes(postId)) {
    user.savedPosts.splice(user.savedPosts.indexOf(postId), 1);

    message = "Post has been removed from collection.";
  } else {
    user.savedPosts.push(postId);

    message = "Post has been saved to collection.";
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message,
    data: {
      post
    }
  });
});

exports.getAll = handlerFactory.getAll(Post);
exports.getOne = handlerFactory.getOne(Post);
// exports.createOne = handlerFactory.createOne(Post);
exports.deleteOne = handlerFactory.deleteOne(Post);
exports.updateOne = handlerFactory.updateOne(Post, ["description"]);
