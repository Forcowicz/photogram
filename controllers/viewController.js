const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

exports.getHomepage = catchAsync(async (req, res, next) => {
  // Get posts

  const posts = await Post.find({ archived: false })
    .populate({ path: "author", select: "username email _id" })
    .populate({
      path: "comments",
      select: "authorId _id content likeCount",
      populate: { path: "authorId", select: "username _id" }
    })
    .sort({ createdAt: -1 })
    .limit(10);

  posts.forEach((post) => (post.comments ? post.comments.slice(0, 2) : post));

  console.log(posts[0].comments);
  // const postPromises = response.map((el) => (el.comments = Comment.find({ postId: el.id })));

  // const posts = await Promise.all(postPromises.comments);

  const payload = {
    posts
  };

  res.status(200).render("homepage", payload);
});
