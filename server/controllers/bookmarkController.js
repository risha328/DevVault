const Bookmark = require("../models/Bookmark");
const Resource = require("../models/Resource");
const Tutorial = require("../models/Tutorial");
const mongoose = require("mongoose");

// Toggle bookmark on a resource or tutorial
exports.bookmarkItem = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user._id;

    console.log('Bookmark request:', { id, type, userId });

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId:', id);
      return res.status(400).json({ success: false, message: "Invalid Item ID" });
    }

    // Validate type
    if (!["resource", "tutorial"].includes(type)) {
      console.log('Invalid type:', type);
      return res.status(400).json({ success: false, message: "Invalid item type. Must be 'resource' or 'tutorial'" });
    }

    // Check if item exists
    let item;
    if (type === "resource") {
      item = await Resource.findById(id);
      console.log('Resource found:', !!item);
    } else {
      item = await Tutorial.findById(id);
      console.log('Tutorial found:', !!item);
    }

    if (!item) {
      console.log('Item not found:', { type, id });
      return res.status(404).json({ success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` });
    }

    // Check if bookmark exists
    const existingBookmark = await Bookmark.findOne({ user: userId, itemType: type, itemId: id });
    console.log('Existing bookmark:', !!existingBookmark);

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      console.log('Bookmark removed');
      res.json({ success: true, message: "Bookmark removed" });
    } else {
      // Add bookmark
      const newBookmark = new Bookmark({ user: userId, itemType: type, itemId: id });
      await newBookmark.save();
      console.log('Bookmark added');
      res.json({ success: true, message: "Bookmark added" });
    }
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all bookmarked items for the logged-in user
exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find bookmarks and populate item details
    const bookmarks = await Bookmark.find({ user: userId }).sort({ createdAt: -1 });

    const bookmarkedItems = [];

    for (const bookmark of bookmarks) {
      let item;
      if (bookmark.itemType === "resource") {
        item = await Resource.findById(bookmark.itemId);
      } else {
        item = await Tutorial.findById(bookmark.itemId);
      }

      if (item) {
        bookmarkedItems.push({
          ...item.toObject(),
          type: bookmark.itemType,
          bookmarkedAt: bookmark.createdAt
        });
      }
    }

    res.json({ success: true, data: bookmarkedItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all bookmarks for admin (with user and item details)
exports.getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const bookmarksWithDetails = [];

    for (const bookmark of bookmarks) {
      let item;
      let itemTitle = "Unknown Item";
      let itemDescription = "";

      if (bookmark.itemType === "resource") {
        item = await Resource.findById(bookmark.itemId);
        if (item) {
          itemTitle = item.title;
          itemDescription = item.description;
        }
      } else if (bookmark.itemType === "tutorial") {
        item = await Tutorial.findById(bookmark.itemId);
        if (item) {
          itemTitle = item.title;
          itemDescription = item.description;
        }
      }

      bookmarksWithDetails.push({
        _id: bookmark._id,
        user: bookmark.user,
        itemType: bookmark.itemType,
        itemId: bookmark.itemId,
        itemTitle,
        itemDescription,
        createdAt: bookmark.createdAt,
      });
    }

    res.json({ success: true, data: bookmarksWithDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
