const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/postModel");

exports.getHomepage = catchAsync(async (req, res, next) => {
  // Get posts

  const posts = await Post.find({ archived: false }).populate({ path: "authorId", select: "username email" });

  console.log(posts);

  const payload = {
    posts
  };

  res.status(200).render("homepage", payload);
});
