const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.use(authController.protect);

router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

router.get("/:id/followers", userController.getFollowers);
router.get("/:id/following", userController.getFollowing);
router.get("/:id/tagged", userController.getWhereTagged);
router.get("/:id/savedPosts", userController.getSavedPosts);

router.use(authController.protect, authController.restrictTo("mod", "admin"));

router.get("/", userController.getAll);
router.route("/:id").get(userController.getOne).delete(userController.deleteOne);

router.use(authController.restrictTo("admin"));

router.route("/").post(userController.createOne);
router.route("/:id").patch(userController.updateOne);

module.exports = router;
