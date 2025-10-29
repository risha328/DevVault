const mongoose = require("mongoose");

const discussionReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  discussionId: { type: mongoose.Schema.Types.ObjectId, ref: "Discussion", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isAcceptedAnswer: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("DiscussionReply", discussionReplySchema);
