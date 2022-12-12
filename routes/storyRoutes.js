const express = require("express");
const authController = require("../controllers/authController");
const storyController = require("../controllers/storyController");

const router = express.Router();

router.use(authController.protect);

router.route("/").post(storyController.createOne);
router.route("/:id").get(storyController.getOne).delete(storyController.deleteOne);

router.use(authController.restrictTo("mod", "admin"));

router.get("/", storyController.getAll);
router.patch("/:id", storyController.updateOne);

module.exports = router;
