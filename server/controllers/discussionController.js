const Discussion = require("../models/Discussion");
const DiscussionReply = require("../models/DiscussionReply");
const User = require("../models/User");

// GET /api/discussions - Get all discussions with pagination and filtering
exports.getDiscussions = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sortBy = 'lastActivity', search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'lastActivity':
        sortOptions = { lastActivity: -1 };
        break;
      case 'mostReplies':
        sortOptions = { replies: -1 };
        break;
      case 'mostViewed':
        sortOptions = { views: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { lastActivity: -1 };
    }

    const discussions = await Discussion.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Discussion.countDocuments(query);

    res.status(200).json({
      success: true,
      data: discussions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDiscussions: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/discussions/:id - Get single discussion
exports.getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!discussion) {
      return res.status(404).json({ success: false, message: "Discussion not found" });
    }

    // Increment view count
    discussion.views += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/discussions - Create new discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required" });
    }

    const discussion = await Discussion.create({
      title,
      content,
      category,
      tags: tags || [],
      createdBy: req.user._id
    });

    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: populatedDiscussion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/discussions/:id - Update discussion
exports.updateDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Only owner can update their discussion
    if (discussion.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot update this discussion" });
    }

    const { title, content, category, tags, isPinned, isSolved } = req.body;

    discussion.title = title || discussion.title;
    discussion.content = content || discussion.content;
    discussion.category = category || discussion.category;
    discussion.tags = tags || discussion.tags;
    discussion.lastActivity = new Date();

    // Admin only fields
    if (req.user.role === 'admin') {
      discussion.isPinned = isPinned !== undefined ? isPinned : discussion.isPinned;
      discussion.isSolved = isSolved !== undefined ? isSolved : discussion.isSolved;
    }

    await discussion.save();

    const updatedDiscussion = await Discussion.findById(discussion._id)
      .populate('createdBy', 'name email');

    res.status(200).json({ success: true, data: updatedDiscussion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/discussions/:id - Delete discussion
exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Only owner or admin can delete
    if (discussion.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You cannot delete this discussion" });
    }

    // Delete all replies first
    await DiscussionReply.deleteMany({ discussionId: req.params.id });

    await discussion.deleteOne();
    res.status(200).json({ success: true, message: "Discussion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/discussions/:id/replies - Add reply to discussion
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const reply = await DiscussionReply.create({
      content,
      discussionId: req.params.id,
      createdBy: req.user._id
    });

    // Update discussion reply count and last activity
    discussion.replies += 1;
    discussion.lastActivity = new Date();
    await discussion.save();

    const populatedReply = await DiscussionReply.findById(reply._id)
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: populatedReply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/discussions/:id/replies - Get replies for discussion
exports.getReplies = async (req, res) => {
  try {
    const replies = await DiscussionReply.find({ discussionId: req.params.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: replies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/discussions/replies/:id - Delete reply
exports.deleteReply = async (req, res) => {
  try {
    const reply = await DiscussionReply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Only owner or admin can delete
    if (reply.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You cannot delete this reply" });
    }

    // Update discussion reply count
    const discussion = await Discussion.findById(reply.discussionId);
    if (discussion) {
      discussion.replies = Math.max(0, discussion.replies - 1);
      await discussion.save();
    }

    await reply.deleteOne();
    res.status(200).json({ success: true, message: "Reply deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/discussions/replies/:id/accept - Mark reply as accepted answer (discussion owner only)
exports.acceptAnswer = async (req, res) => {
  try {
    const reply = await DiscussionReply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const discussion = await Discussion.findById(reply.discussionId);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Only discussion owner can accept answers
    if (discussion.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the discussion owner can accept answers" });
    }

    // Remove previous accepted answer
    await DiscussionReply.updateMany(
      { discussionId: reply.discussionId, isAcceptedAnswer: true },
      { isAcceptedAnswer: false }
    );

    reply.isAcceptedAnswer = true;
    await reply.save();

    // Mark discussion as solved
    discussion.isSolved = true;
    await discussion.save();

    res.status(200).json({ success: true, message: "Answer accepted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/discussions/categories - Get available categories
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      'General',
      'React',
      'Vue.js',
      'Angular',
      'Node.js',
      'Python',
      'JavaScript',
      'TypeScript',
      'DevOps',
      'Database',
      'Mobile Development',
      'Career',
      'Tools & Software',
      'Architecture',
      'Security',
      'Testing',
      'UI/UX',
      'Other'
    ];

    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
