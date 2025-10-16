const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemType: { type: String, enum: ["resource", "tutorial"], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

// Ensure a user can bookmark an item only once
bookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
