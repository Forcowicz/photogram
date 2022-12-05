const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const getCollectonName = (Model) => Model.collection.collectionName.slice(0, -1);

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const entities = await Model.find();

    res.status(200).json({
      status: "success",
      results: entities.length,
      data: {
        [`${getCollectonName(Model)}s`]: entities
      }
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const entity = await Model.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        [getCollectonName(Model)]: entity
      }
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const entity = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        [getCollectonName(Model)]: entity
      }
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    await Model.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      data: null
    });
  });

exports.updateOne = (Model, allowedProperties = []) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    let filteredData = {};

    for (const [key, value] of Object.entries(req.body)) {
      if (allowedProperties.includes(key)) filteredData[key] = value;
    }

    if (Object.keys(filteredData).length === 0)
      return next(new AppError(400, `Only some properties can be edited: ${allowedProperties}`));

    const entity = await Model.findByIdAndUpdate(id, filteredData, { new: true });

    res.status(200).json({
      status: "success",
      data: {
        [getCollectonName(Model)]: entity
      }
    });
  });
