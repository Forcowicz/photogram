const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(postController.getAll).post(postController.createOne);
router.route("/:id").get(postController.getOne).delete(postController.deleteOne).patch(postController.updateOne);

router.patch("/saveOrUnsavePost/:id", postController.saveOrUnsavePost);

module.exports = router;
