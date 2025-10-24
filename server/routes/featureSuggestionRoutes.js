const express = require("express");
const router = express.Router();
const {
  submitSuggestion,
  getAllSuggestions,
  getUserSuggestions,
  updateSuggestionStatus,
  getSuggestionById,
  deleteSuggestion,
} = require("../controllers/featureSuggestionController");

const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Public route - anyone can submit suggestions
router.post("/", submitSuggestion);

// Authenticated user routes
router.get("/user", authMiddleware, getUserSuggestions);

// Public route - anyone can view all suggestions
router.get("/", getAllSuggestions);
router.put("/:id/status", adminAuthMiddleware, updateSuggestionStatus); // Admin can update status

// Public route - anyone can view single suggestion
router.get("/:id", getSuggestionById);

// Admin route - delete suggestion
router.delete("/:id", adminAuthMiddleware, deleteSuggestion);

module.exports = router;
