const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile, getUsers, getResources, updateResourceStatus, getDiscussions, getDiscussionById, getDiscussionReplies, getDashboardStats, getPublicStats, getAnalyticsData } = require("../controllers/adminAuthController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Public routes
router.get("/public-stats", getPublicStats);

// Protected routes
router.get("/profile", authMiddleware, getAdminProfile);
router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/analytics", authMiddleware, getAnalyticsData);
router.get("/users", authMiddleware, getUsers);
router.get("/resources", authMiddleware, getResources);
router.put("/resources/:id/status", authMiddleware, updateResourceStatus);
router.get("/discussions", authMiddleware, getDiscussions);
router.get("/discussions/:id", authMiddleware, getDiscussionById);
router.get("/discussions/:id/replies", authMiddleware, getDiscussionReplies);

module.exports = router;
