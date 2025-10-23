const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile, getUsers, getResources, updateResourceStatus } = require("../controllers/adminAuthController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/profile", authMiddleware, getAdminProfile);
router.get("/users", authMiddleware, getUsers);
router.get("/resources", authMiddleware, getResources);
router.put("/resources/:id/status", authMiddleware, updateResourceStatus);

module.exports = router;
