const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/AppError");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

exports.savePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, `Couldn't find post with this ID: ${postId}`));

  await User.findByIdAndUpdate(req.user._id, { $push: { savedPosts: postId } });

  res.status(200).json({
    status: "success",
    message: "Post has been saved to your collection.",
    data: {
      post
    }
  });
});

// TODO: Make sure user can't save the same post twice

exports.unsavePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  await User.findByIdAndUpdate(req.user._id, { $pull: { savedPosts: postId } });

  res.status(200).json({
    status: "success",
    message: "Post has been removed from your collection."
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, "This post doesn't exist."));

  post.likes.push(userId);
  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "You liked this post."
  });
});

exports.dislikePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;

  await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

  res.status(200).json({
    status: "success",
    message: "You disliked this post."
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError(404, "Post has not been found."));

  const commentData = {
    authorId: req.user._id,
    postId,
    // type: "regular",
    content: req.body.content
  };

  const comment = await Comment.create(commentData);

  post.comments.push(comment._id);
  await post.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    data: {
      comment
    }
  });
});

exports.removeComment = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

  res.status(204).json({
    status: "success",
    message: "Comment deleted."
  });
});

exports.tagUsers = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const usersToTag = req.body.users;

  if (!usersToTag || usersToTag.length === 0) return next(new AppError(400, "Please provide users to tag."));

  const taggedUserIds = Array.isArray(usersToTag) ? usersToTag : [usersToTag];

  const userCheckPromises = taggedUserIds.map((id) => User.exists({ _id: id }));
  const result = await Promise.all(userCheckPromises);
  if (result.some((el) => !el)) return next(new AppError(404, "Some users have not been found in the database."));

  await Post.findByIdAndUpdate(postId, { $addToSet: { tagged: { $each: taggedUserIds } } });

  res.status(200).json({
    status: "success",
    message: `You tagged users: ${taggedUserIds}`
  });
});

exports.untagUsers = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const usersToUntag = req.body.users;

  if (!usersToUntag || usersToUntag.length === 0) return next(new AppError(400, "Please provide users to untag."));

  const taggedUserIds = Array.isArray(usersToUntag) ? usersToUntag : [usersToUntag];

  await Post.findByIdAndUpdate(postId, { $pull: { tagged: { $in: taggedUserIds } } });

  res.status(200).json({
    status: "success",
    message: `You've untagged users ${taggedUserIds} from post ${postId}`
  });
});

exports.getLikes = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId).populate("likes").select({ likes: 1 });

  likes = post.likes;

  res.status(200).json({
    status: "success",
    data: {
      likes
    }
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const comments = await Comment.find({ postId });

  res.status(200).json({
    status: "success",
    data: {
      comments
    }
  });
});

exports.getAll = handlerFactory.getAll(Post, { populate: { path: "author comments" }, searchField: "name" });
exports.getOne = handlerFactory.getOne(Post);
exports.createOne = handlerFactory.createOne(Post, {
  allowedFields: ["description", "imageUrl", "tagged"],
  authorField: "authorId"
});
exports.deleteOne = handlerFactory.deleteOne(Post);
exports.updateOne = handlerFactory.updateOne(Post, { allowedFields: ["description"] });
