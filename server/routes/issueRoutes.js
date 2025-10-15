const express = require("express");
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus } = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected route for creating issues (require auth)
router.post("/", authMiddleware, createIssue);

// Protected routes (require auth)
router.get("/", authMiddleware, getIssues);
router.put("/:id/status", authMiddleware, updateIssueStatus);

module.exports = router;
