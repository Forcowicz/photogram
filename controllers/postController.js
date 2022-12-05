const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Post = require("../models/postModel");

exports.createOne = catchAsync(async (req, res, next) => {
  console.log(req.body, typeof req.body);

  const post = await Post.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      post
    }
  });
});
