const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}d`
  });

const createSendJWT = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return next(new AppError(401, "You need to be logged in to access this resource."));

  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  ///

  const currentUser = await User.findById(decodedToken.userId);

  if (!currentUser) return next(new AppError(404, "Your account has been deleted."));

  req.user = currentUser;

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) return next();

    return next(new AppError(403, "You don't have access to this resource."));
  };

exports.signUp = catchAsync(async (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  };

  const user = await User.create(data);

  createSendJWT(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) return next(new AppError(400, "Please provide username and password."));

  const user = await User.findOne({ username });

  if (!user) return next(new AppError(404, "User not found."));

  if (!(await user.correctPassword(password, user.password))) return next(new AppError(401, "Wrong credentials."));

  if (!user.active) return next(new AppError(401, "Your account is currently disabled."));

  createSendJWT(user, 200, res);
});
