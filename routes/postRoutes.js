const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(postController.getAll).post(postController.createOne);
router.route("/:id").get(postController.getOne).delete(postController.deleteOne).patch(postController.updateOne);

router.patch("/savePost/:id", postController.savePost);
router.patch("/unsavePost/:id", postController.unsavePost);

router.patch("/like/:id", postController.likePost);
router.patch("/dislike/:id", postController.dislikePost);

router.patch("/tagUsers/:id", postController.tagUsers);
router.patch("/untagUsers/:id", postController.untagUsers);

router.get("/:id/likes", postController.getLikes);
router.route("/:id/comments").get(postController.getComments).post(postController.addComment);

router.post("/:postId/comments/:commentId", postController.removeComment);

module.exports = router;
