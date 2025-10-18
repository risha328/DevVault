const express = require("express");
const router = express.Router();
const {
  submitSuggestion,
  getAllSuggestions,
  getUserSuggestions,
  updateSuggestionStatus,
  getSuggestionById,
} = require("../controllers/featureSuggestionController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route - anyone can submit suggestions
router.post("/", submitSuggestion);

// Authenticated user routes
router.get("/user", authMiddleware, getUserSuggestions);

// Public route - anyone can view all suggestions
router.get("/", getAllSuggestions);
router.put("/:id/status", authMiddleware, updateSuggestionStatus); // Admin can update status

// Public route - anyone can view single suggestion
router.get("/:id", getSuggestionById);

module.exports = router;
