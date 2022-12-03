const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide your username!"],
    unique: [true, "This username has been already taken!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: [true, "This email has been already taken!"],
    lowercase: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
