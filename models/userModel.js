const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide your username!"],
    unique: [true, "This username has been already taken!"]
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: [true, "This email has been already taken!"],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Please provide your desired password!"],
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [32, "Password can be 32 characters long"]
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter your password!"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Passwords do not match!"
    }
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (val) {
        return val.length === 9;
      }
    },
    message: "Please provide a valid phone number."
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ["user", "business", "mod", "admin"],
    default: "user"
  },
  private: {
    type: Boolean,
    default: false
  },
  savedPosts: [mongoose.Schema.ObjectId]
});

// TODO: Add phone number validation

// Hooks

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// Schema methods

userSchema.methods.correctPassword = async function (passwordToValidate, userPassword) {
  return await bcrypt.compare(passwordToValidate, userPassword);
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
