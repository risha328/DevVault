const express = require("express");
const router = express.Router();
const {
  addResource,
  getApprovedResources,
  getFeaturedResources,
  getUserResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getApprovedResources);
router.get("/featured", getFeaturedResources);

// Authenticated user routes
router.get("/user", authMiddleware, getUserResources);
router.get("/:id", authMiddleware, getResourceById);
router.post("/", authMiddleware,  addResource);
router.put("/:id", authMiddleware,  updateResource);
router.delete("/:id", authMiddleware,  deleteResource);

module.exports = router;
