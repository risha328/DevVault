const Bookmark = require("../models/Bookmark");
const Resource = require("../models/Resource");
const mongoose = require("mongoose");

// Toggle bookmark on a resource
exports.bookmarkResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Resource ID" });
    }

    // Check if resource exists
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Check if bookmark exists
    const existingBookmark = await Bookmark.findOne({ user: userId, resource: id });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      res.json({ success: true, message: "Bookmark removed" });
    } else {
      // Add bookmark
      const newBookmark = new Bookmark({ user: userId, resource: id });
      await newBookmark.save();
      res.json({ success: true, message: "Bookmark added" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all bookmarked resources for the logged-in user
exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find bookmarks and populate resource details
    const bookmarks = await Bookmark.find({ user: userId })
      .populate("resource")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookmarks.map(b => b.resource) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
