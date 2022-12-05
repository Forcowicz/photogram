const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.route("/").post(postController.createOne);

module.exports = router;
