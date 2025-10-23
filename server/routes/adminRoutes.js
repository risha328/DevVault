const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile, getUsers } = require("../controllers/adminAuthController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/profile", authMiddleware, getAdminProfile);
router.get("/users", authMiddleware, getUsers);

module.exports = router;
