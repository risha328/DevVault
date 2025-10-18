const ContentReport = require("../models/ContentReport");

exports.createContentReport = async (req, res) => {
  try {
    const {
      contentType,
      contentUrl,
      reportReason,
      description,
      contactEmail
    } = req.body;

    // If user is authenticated, attach createdBy
    const createdBy = req.user ? req.user._id : null;
    const createdByName = req.user ? req.user.name : null;

    const contentReport = await ContentReport.create({
      contentType,
      contentUrl,
      reportReason,
      description,
      contactEmail,
      createdBy,
      createdByName
    });

    res.status(201).json({ success: true, contentReport });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getContentReports = async (req, res) => {
  try {
    const contentReports = await ContentReport.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, contentReports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getContentReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const contentReport = await ContentReport.findById(id).populate("createdBy", "name email");
    if (!contentReport) return res.status(404).json({ message: "Content report not found" });

    res.status(200).json({ success: true, contentReport });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateContentReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contentReport = await ContentReport.findByIdAndUpdate(id, { status }, { new: true });
    if (!contentReport) return res.status(404).json({ message: "Content report not found" });

    res.status(200).json({ success: true, contentReport });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
