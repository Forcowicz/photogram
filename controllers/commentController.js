const handlerFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

exports.createOne = catchAsync(async (req, res, next) => {
  const data = Object.assign({ author: req.user._id }, req.body);

  const comment = await Model.create(data);

  res.status(201).json({
    status: "success",
    data: {
      comment
    }
  });
});

exports.getAll = handlerFactory.getAll(Comment, { searchField: "content" });
exports.getOne = handlerFactory.getOne(Comment);
// exports.createOne = handlerFactory.createOne(Comment);
