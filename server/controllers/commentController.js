const Comment = require("../models/Comment");
const Resource = require("../models/Resource");

// GET /api/resources/:id/comments
exports.getCommentsByResource = async (req, res) => {
  try {
    const comments = await Comment.find({ resourceId: req.params.id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/resources/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const comment = await Comment.create({
      content,
      createdBy: req.user._id,
      resourceId: req.params.id
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only owner can delete their comment
    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot delete this comment" });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
