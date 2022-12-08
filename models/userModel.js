const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { phone } = require("phone");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide your username!"],
      unique: [true, "This username has been already taken!"]
    },
    email: {
      type: String,
      required: [true, "Please provide your email!"],
      unique: [true, "This email has been already taken!"],
      lowercase: true,
      validate: {
        validator: function (val) {
          return validator.isEmail(val);
        },
        message: "Please enter a valid email address."
      }
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
          return phone(val, { country: "PL" }).isValid;
        },
        message: "Please provide a valid phone number."
      }
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
    savedPosts: {
      type: mongoose.Schema.ObjectId,
      select: false
    },
    followers: {
      type: [mongoose.Schema.ObjectId]
      // select: false
    },
    following: {
      type: [mongoose.Schema.ObjectId]
      // select: false
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
    // id: false
  }
);

// TODO: Add phone number validation

// Hooks

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  this.phoneNumber = phone(this.phoneNumber).phoneNumber;

  next();
});

// Schema methods

userSchema.methods.correctPassword = async function (passwordToValidate, userPassword) {
  return await bcrypt.compare(passwordToValidate, userPassword);
};

// Virtuals

userSchema.virtual("followerCount").get(function () {
  return this.followers.length;
});

userSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
