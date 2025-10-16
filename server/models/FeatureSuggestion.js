const mongoose = require("mongoose");

const featureSuggestionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  useCase: { type: String, required: true },
  benefits: { type: String },
  alternatives: { type: String },
  priority: { type: String, enum: ["low", "medium", "high", "game-changer"], default: "medium" },
  contactEmail: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional, for authenticated users
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("FeatureSuggestion", featureSuggestionSchema);
