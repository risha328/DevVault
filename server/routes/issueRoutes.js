const express = require("express");
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus } = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected route for creating issues (require auth)
router.post("/", authMiddleware, createIssue);

// Public route for getting issues
router.get("/", getIssues);
router.put("/:id/status", authMiddleware, updateIssueStatus);

module.exports = router;
