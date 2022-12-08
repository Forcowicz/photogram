const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.route("/").get(commentController.getAll).post(commentController.createOne);
router.route("/:id").get(commentController.getOne);

module.exports = router;
