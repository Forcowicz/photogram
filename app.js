const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: `${__dirname}/config.env` });
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");

const app = express();

app.use(morgan("dev"));

// Config

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Routing

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

// For unhandled routes

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Cannot find this resource."
  });
});

app.use(globalErrorHandler);

module.exports = app;
