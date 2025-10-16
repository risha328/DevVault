const mongoose = require("mongoose");

const docImprovementSchema = new mongoose.Schema({
  docType: { type: String, required: true },
  specificPage: { type: String },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  suggestedFix: { type: String },
  contactEmail: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional, if user is logged in
}, { timestamps: true });

module.exports = mongoose.model("DocImprovement", docImprovementSchema);
