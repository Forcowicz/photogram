const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/AppError");
const Post = require("../models/postModel");

exports.getAll = handlerFactory.getAll(Post);
exports.getOne = handlerFactory.getOne(Post);
exports.createOne = handlerFactory.createOne(Post);
exports.deleteOne = handlerFactory.deleteOne(Post);
exports.updateOne = handlerFactory.updateOne(Post, ["description"]);
