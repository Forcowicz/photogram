const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    mediaSrc: {
      type: String,
      required: [true, "Please provide a media source for the story."]
    },
    views: {
      type: [mongoose.Schema.ObjectId],
      ref: "User"
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: "User"
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 24 * 60 * 60 * 1000
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// TODO: Change authorId to author in other models

// Virtuals

storySchema.virtual("viewCount").get(function () {
  return this.views?.length || 0;
});

storySchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

// Model

const Story = new mongoose.model("Story", storySchema);

module.exports = Story;
