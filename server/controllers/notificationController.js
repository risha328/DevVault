const Notification = require("../models/Notification");
const User = require("../models/User");

// Get user's notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = req.user._id;

    const query = { recipient: userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate("sender", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasNextPage: page * limit < total
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.status(200).json({ success: true, unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create notification (internal function)
exports.createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();

    // Emit real-time notification via Socket.io
    if (global.io) {
      global.io.to(data.recipient.toString()).emit('notification', {
        ...notification.toObject(),
        sender: data.sender ? await User.findById(data.sender).select('name email') : null
      });
    }

    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    return null;
  }
};

// Helper function to create admin approval notification
exports.createAdminApprovalNotification = async (userId, contentType, contentTitle, adminName = 'Admin') => {
  const messages = {
    resource: `Your resource "${contentTitle}" has been approved by ${adminName}`,
    tutorial: `Your tutorial "${contentTitle}" has been published`,
    discussion: `Your discussion "${contentTitle}" has been approved`,
    feature: `Your feature suggestion "${contentTitle}" has been approved`,
    doc: `Your documentation improvement "${contentTitle}" has been approved`
  };

  const titles = {
    resource: 'Resource Approved',
    tutorial: 'Tutorial Published',
    discussion: 'Discussion Approved',
    feature: 'Feature Suggestion Approved',
    doc: 'Documentation Improvement Approved'
  };

  return await exports.createNotification({
    recipient: userId,
    type: 'admin_approval',
    title: titles[contentType] || 'Content Approved',
    message: messages[contentType] || `Your content "${contentTitle}" has been approved`,
    relatedModel: contentType === 'resource' ? 'Resource' :
                 contentType === 'tutorial' ? 'Tutorial' :
                 contentType === 'discussion' ? 'Discussion' :
                 contentType === 'feature' ? 'FeatureSuggestion' :
                 contentType === 'doc' ? 'DocImprovement' : null
  });
};
