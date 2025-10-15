const express = require("express");
const router = express.Router();
const { rateResource } = require("../controllers/rateController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/resources/:id/rate - Toggle upvote on resource
router.post("/:id/rate", authMiddleware, rateResource);

module.exports = router;
