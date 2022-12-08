const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.use(authController.protect);

router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

router.use(authController.protect, authController.restrictTo("mod", "admin"));

router.get("/", userController.getAll);
router.route("/:id").get(userController.getOne).delete(userController.deleteOne);

router.use(authController.restrictTo("admin"));

router.route("/").post(userController.createOne);
router.route("/:id").patch(userController.updateOne);

module.exports = router;
