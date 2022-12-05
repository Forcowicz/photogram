const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Post = require("../models/postModel");

exports.getAll = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts
    }
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const post = await Post.findById(id);

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      post
    }
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  await Post.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const data = { description: req.body.description };

  if (!req.body.description) return next(new AppError(400, "You can only edit post's description."));

  const post = await Post.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});
