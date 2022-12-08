const handlerFactory = require("./handlerFactory");
const Comment = require("../models/commentModel");

exports.getAll = handlerFactory.getAll(Comment);
exports.getOne = handlerFactory.getOne(Comment);
exports.createOne = handlerFactory.createOne(Comment);
