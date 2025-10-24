const FeatureSuggestion = require("../models/FeatureSuggestion");

// Submit a new feature suggestion
exports.submitSuggestion = async (req, res) => {
  try {
    const { category, title, description, useCase, benefits, alternatives, priority, contactEmail } = req.body;

    const newSuggestion = new FeatureSuggestion({
      category,
      title,
      description,
      useCase,
      benefits,
      alternatives,
      priority,
      contactEmail,
      createdBy: req.user ? req.user._id : null, // Associate with user if authenticated
    });

    const saved = await newSuggestion.save();
    res.status(201).json({ success: true, data: saved, message: "Feature suggestion submitted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all feature suggestions (public)
exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await FeatureSuggestion.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get suggestions by user (if authenticated)
exports.getUserSuggestions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find suggestions created by the user or where contactEmail matches user's email (for anonymous submissions)
    const suggestions = await FeatureSuggestion.find({
      $or: [
        { createdBy: req.user._id },
        { contactEmail: req.user.email, createdBy: null }
      ]
    })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update suggestion status (admin only)
exports.updateSuggestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const suggestion = await FeatureSuggestion.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ success: false, message: "Suggestion not found" });
    }

    res.json({ success: true, data: suggestion });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single suggestion by ID
exports.getSuggestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const suggestion = await FeatureSuggestion.findById(id)
      .populate("createdBy", "name email");

    if (!suggestion) {
      return res.status(404).json({ success: false, message: "Suggestion not found" });
    }

    res.json({ success: true, data: suggestion });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete suggestion (admin only)
exports.deleteSuggestion = async (req, res) => {
  try {
    const { id } = req.params;

    const suggestion = await FeatureSuggestion.findByIdAndDelete(id);

    if (!suggestion) {
      return res.status(404).json({ success: false, message: "Suggestion not found" });
    }

    res.json({ success: true, message: "Suggestion deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
