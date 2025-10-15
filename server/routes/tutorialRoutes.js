const express = require("express");
const router = express.Router();
const {
  createTutorial,
  getTutorials,
  getTutorialById,
  updateTutorial,
  deleteTutorial,
  likeTutorial
} = require("../controllers/tutorialController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route for browsing published tutorials
router.get("/", getTutorials);

// Protected routes
router.post("/", authMiddleware, createTutorial);
router.get("/:id", authMiddleware, getTutorialById);
router.put("/:id", authMiddleware, updateTutorial);
router.delete("/:id", authMiddleware, deleteTutorial);
router.post("/:id/like", authMiddleware, likeTutorial);

module.exports = router;
