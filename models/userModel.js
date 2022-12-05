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
  password: {
    type: String,
    required: [true, "Please provide your desired password!"],
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [32, "Password can be 32 characters long"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter your password!"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Passwords do not match!",
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
