const express = require("express");
const router = express.Router();
const { createContentReport, getContentReports, updateContentReportStatus } = require("../controllers/contentReportController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route for creating content reports (no auth required)
router.post("/", createContentReport);

// Protected routes (require auth)
router.get("/", authMiddleware, getContentReports);
router.put("/:id/status", authMiddleware, updateContentReportStatus);

module.exports = router;
