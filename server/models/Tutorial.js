const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  estimatedTime: { type: Number }, // in minutes
  prerequisites: [{ type: String }],
  learningObjectives: [{ type: String }],
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdByName: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

// Index for search
tutorialSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model("Tutorial", tutorialSchema);
