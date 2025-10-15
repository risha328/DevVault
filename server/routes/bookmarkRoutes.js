const express = require("express");
const router = express.Router();
const { bookmarkResource, getUserBookmarks } = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/resources/:id/bookmark - Toggle bookmark on resource
router.post("/:id/bookmark", authMiddleware, bookmarkResource);

// GET /api/user/bookmarks - Get all bookmarked resources for logged-in user
router.get("/user/bookmarks", authMiddleware, getUserBookmarks);

module.exports = router;
