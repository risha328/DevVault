const Issue = require("../models/Issue");

exports.createIssue = async (req, res) => {
  try {
    const {
      issueType,
      title,
      description,
      severity,
      affectedPage,
      browserInfo,
      steps,
      expectedBehavior,
      actualBehavior,
      contactEmail
    } = req.body;

    // If user is authenticated, attach createdBy
    const createdBy = req.user ? req.user._id : null;
    const createdByName = req.user ? req.user.name : null;

    const issue = await Issue.create({
      issueType,
      title,
      description,
      severity,
      affectedPage,
      browserInfo,
      steps,
      expectedBehavior,
      actualBehavior,
      contactEmail,
      createdBy,
      createdByName
    });

    res.status(201).json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, issues });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const issue = await Issue.findByIdAndUpdate(id, { status }, { new: true });
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.status(200).json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
