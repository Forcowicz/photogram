const handlerFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");
const Post = require("../models/postModel");

exports.follow = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  if (userId === req.user.id) return next(new AppError(400, "You cannot follow yourself."));

  const user = await User.findById(userId);

  if (!user) return next(new AppError(404, "User you want to follow doesn't exist."));

  await User.findByIdAndUpdate(req.user._id, { $push: { following: userId } });
  await User.findByIdAndUpdate(userId, { $push: { followers: req.user._id } });

  res.status(200).json({
    status: "success",
    message: `You are now following user ${user.username}`
  });
});

exports.unfollow = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  await User.findByIdAndUpdate(req.user.id, { $pull: { following: userId } });
  await User.findByIdAndUpdate(userId, { $pull: { followers: req.user.id } });

  res.status(200).json({
    status: "success",
    message: `You are no longer following this user.`
  });
});

exports.getFollowers = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const users = await User.findById(userId).populate("followers").select("followers");

  const { followers } = users;

  res.status(200).json({
    status: "success",
    data: {
      followers
    }
  });
});

exports.getFollowing = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const users = await User.findById(userId).populate("following").select("following");

  const { following } = users;

  res.status(200).json({
    status: "success",
    data: { following }
  });
});

exports.getWhereTagged = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const posts = await Post.find().where("tagged").equals(userId);

  res.status(200).json({
    status: "success",
    data: {
      posts
    }
  });
});

exports.getSavedPosts = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const result = await User.findById(userId).populate("savedPosts").select("savedPosts");

  const posts = result.savedPosts;

  res.status(200).json({
    status: "success",
    data: {
      posts
    }
  });
});

exports.getAll = handlerFactory.getAll(User);
exports.getOne = handlerFactory.getOne(User);
exports.createOne = handlerFactory.createOne(User);
exports.updateOne = handlerFactory.updateOne(User);
exports.deleteOne = handlerFactory.deleteOne(User);
