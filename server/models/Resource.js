const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String, required: true },
  ownerId: { type: String },
  category: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);
