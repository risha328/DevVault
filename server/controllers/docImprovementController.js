const DocImprovement = require("../models/DocImprovement");

// Submit a new documentation improvement suggestion
exports.submitDocImprovement = async (req, res) => {
  try {
    const { docType, specificPage, issueType, description, suggestedFix, contactEmail } = req.body;

    const newImprovement = new DocImprovement({
      docType,
      specificPage,
      issueType,
      description,
      suggestedFix,
      contactEmail,
      createdBy: req.user ? req.user._id : null, // Associate with user if authenticated
    });

    const saved = await newImprovement.save();
    res.status(201).json({ success: true, data: saved, message: "Documentation improvement suggestion submitted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all documentation improvement suggestions (for admin)
exports.getAllDocImprovements = async (req, res) => {
  try {
    const improvements = await DocImprovement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: improvements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get approved documentation improvement suggestions (for public display)
exports.getApprovedDocImprovements = async (req, res) => {
  try {
    const improvements = await DocImprovement.find({ status: 'approved' })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: improvements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get documentation improvement suggestions by user (if authenticated)
exports.getUserDocImprovements = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const improvements = await DocImprovement.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: improvements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update documentation improvement status (admin only)
exports.updateDocImprovementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const improvement = await DocImprovement.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!improvement) {
      return res.status(404).json({ success: false, message: "Documentation improvement not found" });
    }

    res.json({ success: true, data: improvement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single documentation improvement by ID
exports.getDocImprovementById = async (req, res) => {
  try {
    const { id } = req.params;
    const improvement = await DocImprovement.findById(id)
      .populate("createdBy", "name email");

    if (!improvement) {
      return res.status(404).json({ success: false, message: "Documentation improvement not found" });
    }

    res.json({ success: true, data: improvement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
