const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issueType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, required: true },
  affectedPage: { type: String },
  browserInfo: { type: String },
  steps: { type: String },
  expectedBehavior: { type: String },
  actualBehavior: { type: String },
  contactEmail: { type: String },
  status: { type: String, enum: ["open", "in-progress", "resolved", "closed"], default: "open" },
  approved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin who approved
  approvedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional, if user is logged in
  createdByName: { type: String }, // Store the name directly
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);
