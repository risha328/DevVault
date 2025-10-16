const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPinned: { type: Boolean, default: false },
  isSolved: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Discussion", discussionSchema);
