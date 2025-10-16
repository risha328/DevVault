const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  getReplies,
  deleteReply,
  acceptAnswer,
  getCategories
} = require("../controllers/discussionController");

// Public routes
router.get("/", getDiscussions);
router.get("/categories", getCategories);
router.get("/:id", getDiscussion);
router.get("/:id/replies", getReplies);

// Protected routes
router.post("/", auth, createDiscussion);
router.put("/:id", auth, updateDiscussion);
router.delete("/:id", auth, deleteDiscussion);

router.post("/:id/replies", auth, addReply);
router.delete("/replies/:id", auth, deleteReply);
router.put("/replies/:id/accept", auth, acceptAnswer);

module.exports = router;
