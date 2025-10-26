const Resource = require("../models/Resource");
const mongoose = require("mongoose");
// Add new resource (status = "approved" for now, can be changed to "pending" later)
exports.addResource = async (req, res) => {
  try {
    const { title, description, link, category, tags } = req.body;

    const newResource = new Resource({
      title,
      description,
      link,
      category,
      tags,
      createdBy: req.user._id, // from auth middleware
      status: "pending", // Set to pending for admin review
    });

    const saved = await newResource.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all approved resources
exports.getApprovedResources = async (req, res) => {
  try {
    const resources = await Resource.find({ status: "approved" })
      .populate("createdBy", "name email");
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get featured resources (top 3 by upvotes)
exports.getFeaturedResources = async (req, res) => {
  try {
    const resources = await Resource.find({ status: "approved" })
      .populate("createdBy", "name email")
      .sort({ upvotes: -1 }) // Sort by upvotes descending
      .limit(3); // Limit to 3 featured resources
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user's own resources
exports.getUserResources = async (req, res) => {
  try {
    const userId = req.user._id;
    const resources = await Resource.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single resource by ID


exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Resource ID" });
    }

    // 2️⃣ Find resource and populate creator info
    const resource = await Resource.findById(id).populate("createdBy", "_id name email");

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // 3️⃣ Safety check: make sure req.user exists
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 4️⃣ Allow owner to view even if pending
    const resourceOwnerId = resource.createdBy?._id?.toString(); // optional chaining
    const currentUserId = req.user?._id?.toString();

    if (resource.status !== "approved" && resourceOwnerId !== currentUserId) {
      return res.status(403).json({ success: false, message: "Not authorized to view this resource" });
    }

    // 5️⃣ Return resource
    res.json({ success: true, data: resource });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// Update resource (only owner can)
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Resource ID" });
    }

    // 2️⃣ Find the resource
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    // 3️⃣ Check req.user exists
    if (!req.user || !req.user._id || req.user.role !== "user") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
 console.log("Resource found:", resource);
    // 4️⃣ Safe check for owner
    const ownerId = resource.createdBy?.toString(); // optional chaining
    const currentUserId = req.user._id.toString();
 console.log("Owner ID:", ownerId, "Current User ID:", currentUserId);  
    if (!ownerId) {
      return res.status(500).json({ success: false, message: "Resource owner not found" });
    }

    if (ownerId !== currentUserId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this resource" });
    }

    // 5️⃣ Update fields safely
    const { title, description, link, category, tags } = req.body;
    if (title) resource.title = title;
    if (description) resource.description = description;
    if (link) resource.link = link;
    if (category) resource.category = category;
    if (tags) resource.tags = tags;

    // Reset approval
    resource.status = "pending";

    const updated = await resource.save();
    res.json({ success: true, data: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Delete resource (only owner can)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await resource.deleteOne();
    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
