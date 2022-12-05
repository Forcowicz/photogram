const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: `${__dirname}/config.env` });
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");

const app = express();

app.use(morgan("dev"));

// Config

app.use(express.json({ limit: "10kb" }));

// Routing

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

module.exports = app;
