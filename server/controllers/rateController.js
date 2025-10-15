const Resource = require("../models/Resource");
const mongoose = require("mongoose");

// Toggle upvote on a resource
exports.rateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Resource ID" });
    }

    // Find the resource
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Check if user already upvoted
    const hasUpvoted = resource.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      resource.upvotes = resource.upvotes.filter(upvote => upvote.toString() !== userId.toString());
    } else {
      // Add upvote
      resource.upvotes.push(userId);
    }

    await resource.save();

    res.json({
      success: true,
      message: hasUpvoted ? "Upvote removed" : "Upvote added",
      upvotesCount: resource.upvotes.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
