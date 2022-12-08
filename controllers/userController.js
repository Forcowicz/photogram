const handlerFactory = require("./handlerFactory");
const User = require("../models/userModel");

exports.getAll = handlerFactory.getAll(User);
exports.getOne = handlerFactory.getOne(User);
exports.createOne = handlerFactory.createOne(User);
exports.updateOne = handlerFactory.updateOne(User);
exports.deleteOne = handlerFactory.deleteOne(User);
