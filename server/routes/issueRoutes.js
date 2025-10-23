const express = require("express");
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus, approveIssue, getApprovedIssues, getUserIssues } = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Public routes
router.get("/approved", getApprovedIssues);

// Protected routes (require authentication)
router.post("/", authMiddleware, createIssue);
router.get("/user", authMiddleware, getUserIssues);

// Admin routes (require admin authentication)
router.get("/", adminAuthMiddleware, getIssues);
router.put("/:id/status", adminAuthMiddleware, updateIssueStatus);
router.put("/:id/approve", adminAuthMiddleware, approveIssue);

module.exports = router;
