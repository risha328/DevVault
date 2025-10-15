const Tutorial = require("../models/Tutorial");

exports.createTutorial = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      tags,
      difficulty,
      estimatedTime,
      prerequisites,
      learningObjectives
    } = req.body;

    const tutorial = await Tutorial.create({
      title,
      description,
      content,
      category,
      tags: tags || [],
      difficulty: difficulty || "beginner",
      estimatedTime,
      prerequisites: prerequisites || [],
      learningObjectives: learningObjectives || [],
      status: "published", // Set status to published when creating
      createdBy: req.user._id,
      createdByName: req.user.name
    });

    res.status(201).json({ success: true, tutorial });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorials = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = { status: "published" }; // Only fetch published tutorials

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$text = { $search: search };
    }

    const tutorials = await Tutorial.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tutorials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("comments");

    if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });

    // Increment views
    tutorial.views += 1;
    await tutorial.save();

    res.status(200).json({ success: true, tutorial });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });

    // Check if user owns the tutorial
    if (tutorial.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this tutorial" });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        tutorial[key] = updates[key];
      }
    });

    await tutorial.save();
    res.status(200).json({ success: true, tutorial });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });

    // Check if user owns the tutorial
    if (tutorial.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this tutorial" });
    }

    await Tutorial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Tutorial deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });

    const userId = req.user._id;
    const likeIndex = tutorial.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      tutorial.likes.splice(likeIndex, 1);
    } else {
      // Like
      tutorial.likes.push(userId);
    }

    await tutorial.save();
    res.status(200).json({ success: true, likes: tutorial.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
