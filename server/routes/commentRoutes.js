const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addComment, getCommentsByResource, deleteComment } = require("../controllers/commentController");

router.get("/resources/:id/comments", getCommentsByResource);
router.post("/resources/:id/comments", auth, addComment);
router.delete("/comments/:id", auth, deleteComment);

module.exports = router;
