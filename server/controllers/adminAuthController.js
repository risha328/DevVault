const User = require("../models/User");
const Resource = require("../models/Resource");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashed, role: "admin" });

    res.status(201).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select('-password');
    if (!admin || admin.role !== "admin") return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({
      success: true,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      name: admin.name,
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('createdBy', 'name email');
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const resource = await Resource.findByIdAndUpdate(id, { status }, { new: true });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const Discussion = require("../models/Discussion");
    const discussions = await Discussion.find().populate('createdBy', 'name email');
    res.json({ success: true, discussions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDiscussionById = async (req, res) => {
  try {
    const Discussion = require("../models/Discussion");
    const discussion = await Discussion.findById(req.params.id).populate('createdBy', 'name email');
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDiscussionReplies = async (req, res) => {
  try {
    const DiscussionReply = require("../models/DiscussionReply");
    const replies = await DiscussionReply.find({ discussionId: req.params.id }).populate('createdBy', 'name email').sort({ createdAt: 1 });
    res.json({ success: true, replies });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
