const express = require("express");
const router = express.Router();
const {
  submitDocImprovement,
  getAllDocImprovements,
  getApprovedDocImprovements,
  getUserDocImprovements,
  updateDocImprovementStatus,
  getDocImprovementById,
} = require("../controllers/docImprovementController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route - anyone can submit documentation improvement suggestions
router.post("/", submitDocImprovement);

// Public route - anyone can view approved suggestions
router.get("/approved", getApprovedDocImprovements);

// Authenticated user routes
router.get("/user", authMiddleware, getUserDocImprovements);

// Get a single documentation improvement by ID
router.get("/:id", authMiddleware, getDocImprovementById);

// Public route - anyone can view all suggestions
router.get("/", getAllDocImprovements);
router.put("/:id/status", authMiddleware, updateDocImprovementStatus); // Admin can update status

module.exports = router;
