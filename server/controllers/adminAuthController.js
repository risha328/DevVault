const User = require("../models/User");
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
