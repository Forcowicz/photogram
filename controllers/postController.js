const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/AppError");
const Post = require("../models/postModel");

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

exports.getAll = handlerFactory.getAll(Post);
exports.getOne = handlerFactory.getOne(Post);
// exports.createOne = handlerFactory.createOne(Post);
exports.deleteOne = handlerFactory.deleteOne(Post);
exports.updateOne = handlerFactory.updateOne(Post, ["description"]);
