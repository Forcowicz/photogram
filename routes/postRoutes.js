const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.route("/").get(postController.getAll).post(postController.createOne);
router.route("/:id").get(postController.getOne).delete(postController.deleteOne).patch(postController.updateOne);

module.exports = router;
