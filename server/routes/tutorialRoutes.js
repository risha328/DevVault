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

// Public routes
router.get("/", getTutorials);
router.get("/:id", getTutorialById);

// Protected routes
router.post("/", authMiddleware, createTutorial);
router.put("/:id", authMiddleware, updateTutorial);
router.delete("/:id", authMiddleware, deleteTutorial);
router.post("/:id/like", authMiddleware, likeTutorial);

module.exports = router;
