const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile, getUserProfile, getUserStats, getLeaderboard} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile); // Protected route, add auth middleware as needed
router.get("/user/:userId", getUserProfile); // Public route to get user profile by ID
router.get("/user/:userId/stats", getUserStats); // Public route to get user stats by ID
router.get("/leaderboard", getLeaderboard); // Public route to get leaderboard

module.exports = router;
