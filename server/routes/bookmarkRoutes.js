const express = require("express");
const router = express.Router();
const { bookmarkItem, getUserBookmarks, getAllBookmarks } = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// POST /api/bookmark/:type/:id - Toggle bookmark on resource or tutorial
router.post("/:type/:id", authMiddleware, bookmarkItem);

// GET /api/bookmark/user/bookmarks - Get all bookmarked items for logged-in user
router.get("/user/bookmarks", authMiddleware, getUserBookmarks);

// GET /api/bookmark/all - Get all bookmarks for admin
router.get("/all", adminAuthMiddleware, getAllBookmarks);

module.exports = router;
