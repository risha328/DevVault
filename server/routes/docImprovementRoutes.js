const express = require("express");
const router = express.Router();
const {
  submitDocImprovement,
  getAllDocImprovements,
  getUserDocImprovements,
  updateDocImprovementStatus,
} = require("../controllers/docImprovementController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route - anyone can submit documentation improvement suggestions
router.post("/", submitDocImprovement);

// Authenticated user routes
router.get("/user", authMiddleware, getUserDocImprovements);

// Admin routes
router.get("/", authMiddleware, getAllDocImprovements); // Admin can view all
router.put("/:id/status", authMiddleware, updateDocImprovementStatus); // Admin can update status

module.exports = router;
