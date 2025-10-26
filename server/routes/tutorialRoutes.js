const express = require("express");
const router = express.Router();
const {
  createTutorial,
  getTutorials,
  getTutorialById,
  updateTutorial,
  deleteTutorial,
  likeTutorial,
  getUserTutorials,
  getUserTutorialsById
} = require("../controllers/tutorialController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getTutorials);
router.get("/user/:userId", getUserTutorialsById); // Public route to get user's published tutorials
router.get("/:id", getTutorialById);

// Protected routes
router.get("/user", authMiddleware, getUserTutorials);
router.post("/", authMiddleware, createTutorial);
router.put("/:id", authMiddleware, updateTutorial);
router.delete("/:id", authMiddleware, deleteTutorial);
router.post("/:id/like", authMiddleware, likeTutorial);

module.exports = router;
