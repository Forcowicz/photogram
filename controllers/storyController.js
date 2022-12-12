const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/AppError");
const Story = require("../models/storyModel");

exports.getOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const story = await Story.findOne({ _id: id, expiresAt: { $gt: Date.now() } }).populate({
    path: "author",
    select: "username email"
  });

  if (!story) return next(new AppError(404, "This story cannot be found."));

  res.status(200).json({
    status: "success",
    data: {
      story
    }
  });
});

exports.createOne = handlerFactory.createOne(Story, { allowedFields: ["mediaSrc"], authorField: "author" });
exports.deleteOne = handlerFactory.deleteOne(Story);

// Only for mod, admin

exports.getAll = handlerFactory.getAll(Story, { populate: { path: "author", select: "username email" } });
exports.updateOne = handlerFactory.updateOne(Story);
