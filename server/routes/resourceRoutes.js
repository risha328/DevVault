const express = require("express");
const router = express.Router();
const {
  addResource,
  getApprovedResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getApprovedResources);
router.get("/:id", authMiddleware, getResourceById);

// Authenticated user routes
router.post("/", authMiddleware,  addResource);
router.put("/:id", authMiddleware,  updateResource);
router.delete("/:id", authMiddleware,  deleteResource);

module.exports = router;
