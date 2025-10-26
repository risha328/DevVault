const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile, getUserProfile} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile); // Protected route, add auth middleware as needed
router.get("/user/:userId", getUserProfile); // Public route to get user profile by ID

module.exports = router;
