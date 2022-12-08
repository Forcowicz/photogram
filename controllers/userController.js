const handlerFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

exports.follow = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  console.log(userId, req.user.id);

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

exports.getAll = handlerFactory.getAll(User);
exports.getOne = handlerFactory.getOne(User);
exports.createOne = handlerFactory.createOne(User);
exports.updateOne = handlerFactory.updateOne(User);
exports.deleteOne = handlerFactory.deleteOne(User);
