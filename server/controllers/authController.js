const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Resource = require("../models/Resource");
const Tutorial = require("../models/Tutorial");
const Issue = require("../models/Issue");
const FeatureSuggestion = require("../models/FeatureSuggestion");
const DocImprovement = require("../models/DocImprovement");
const Discussion = require("../models/Discussion");
const ContentReport = require("../models/ContentReport");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.getProfile = async (req, res) => {
//   res.json(req.user);
// };


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get all contribution counts in parallel
    const [
      resourcesCount,
      tutorialsCount,
      issuesCount,
      featureSuggestionsCount,
      docImprovementsCount,
      discussionsCount,
      contentReportsCount
    ] = await Promise.all([
      Resource.countDocuments({ createdBy: userId }),
      Tutorial.countDocuments({ createdBy: userId }),
      Issue.countDocuments({ createdBy: userId }),
      FeatureSuggestion.countDocuments({ createdBy: userId }),
      DocImprovement.countDocuments({ createdBy: userId }),
      Discussion.countDocuments({ createdBy: userId }),
      ContentReport.countDocuments({ createdBy: userId })
    ]);

    // Calculate total contributions
    const totalContributions = resourcesCount + tutorialsCount + issuesCount +
                              featureSuggestionsCount + docImprovementsCount +
                              discussionsCount + contentReportsCount;

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      stats: {
        resources: resourcesCount,
        tutorials: tutorialsCount,
        issues: issuesCount,
        featureSuggestions: featureSuggestionsCount,
        docImprovements: docImprovementsCount,
        discussions: discussionsCount,
        contentReports: contentReportsCount,
        totalContributions
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Get all users with role "user" only, excluding admins
    const users = await User.find({ role: "user" }).select('-password');

    // Calculate stats for each user in parallel
    const leaderboardPromises = users.map(async (user) => {
      const userId = user._id;

      // Get all contribution counts in parallel
      const [
        resourcesCount,
        tutorialsCount,
        issuesCount,
        featureSuggestionsCount,
        docImprovementsCount,
        discussionsCount,
        contentReportsCount
      ] = await Promise.all([
        Resource.countDocuments({ createdBy: userId }),
        Tutorial.countDocuments({ createdBy: userId }),
        Issue.countDocuments({ createdBy: userId }),
        FeatureSuggestion.countDocuments({ createdBy: userId }),
        DocImprovement.countDocuments({ createdBy: userId }),
        Discussion.countDocuments({ createdBy: userId }),
        ContentReport.countDocuments({ createdBy: userId })
      ]);

      // Calculate total contributions
      const totalContributions = resourcesCount + tutorialsCount + issuesCount +
                                featureSuggestionsCount + docImprovementsCount +
                                discussionsCount + contentReportsCount;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        stats: {
          resources: resourcesCount,
          tutorials: tutorialsCount,
          issues: issuesCount,
          featureSuggestions: featureSuggestionsCount,
          docImprovements: docImprovementsCount,
          discussions: discussionsCount,
          contentReports: contentReportsCount,
          totalContributions
        }
      };
    });

    // Wait for all calculations to complete
    const leaderboard = await Promise.all(leaderboardPromises);

    // Sort by total contributions descending
    leaderboard.sort((a, b) => b.stats.totalContributions - a.stats.totalContributions);

    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
