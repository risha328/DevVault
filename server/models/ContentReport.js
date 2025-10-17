const mongoose = require("mongoose");

const contentReportSchema = new mongoose.Schema({
  contentType: { type: String, required: true },
  contentUrl: { type: String, required: true },
  reportReason: { type: String, required: true },
  description: { type: String, required: true },
  contactEmail: { type: String },
  status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("ContentReport", contentReportSchema);
