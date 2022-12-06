const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.use(authController.protect);

router.route("/").get(userController.getAll);
router.route("/:id").get(userController.getOne).delete(userController.deleteOne);

module.exports = router;
