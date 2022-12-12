const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

const getCollectonName = (Model) => Model.collection.collectionName.slice(0, -1);

exports.getAll = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find({});

    if (options.populate) {
      query = query.populate(options.populate);
    }

    if (req.query.search) {
      query = query.find({
        $or: [
          { username: new RegExp(`^${req.query.search}`, "gi") },
          { name: new RegExp(`^${req.query.search}`, "gi") }
        ]
      });
    }

    if (req.query.fields) {
      query = query.select(req.query.fields.replaceAll(",", " "));
    }

    const entities = await query;

    res.status(200).json({
      status: "success",
      results: entities.length,
      data: {
        [`${getCollectonName(Model)}s`]: entities
      }
    });
  });

exports.getOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    let query = Model.findById(id);

    if (options.populate) {
      query = query.populate(options.populate);
    }

    const entity = await query;

    res.status(200).json({
      status: "success",
      data: {
        [getCollectonName(Model)]: entity
      }
    });
  });

exports.createOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    let data = options.allowedFields ? {} : req.body;

    if (options.allowedFields) {
      for (const [key, val] of Object.entries(req.body)) {
        if (options.allowedFields.includes(key)) data[key] = val;
      }
    }

    if (options.authorField) {
      data[options.authorField] = req.user._id;
    }

    const entity = await Model.create(data);

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

exports.updateOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    let filteredData = options.allowedFields ? {} : req.body;

    if (options.allowedFields) {
      for (const [key, value] of Object.entries(req.body)) {
        if (options.allowedFields.includes(key)) filteredData[key] = value;
      }
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
