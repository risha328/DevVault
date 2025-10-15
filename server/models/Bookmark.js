const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
}, { timestamps: true });

// Ensure a user can bookmark a resource only once
bookmarkSchema.index({ user: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
