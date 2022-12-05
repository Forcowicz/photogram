const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: `${__dirname}/config.env` });
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");

const app = express();

app.use(morgan("dev"));

// Config

app.use(express.json({ limit: "10kb" }));

// Routing

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

// For unhandled routes

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Cannot find this resource."
  });
});

app.use(globalErrorHandler);

module.exports = app;
