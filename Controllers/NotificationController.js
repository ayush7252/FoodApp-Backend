const fs = require("fs");
const path = require("path");
const Notification = require("../Models/Notification");

// Helper: delete image file safely
const deleteImageFile = (filePath) => {
  if (filePath) {
    fs.unlink(path.resolve(filePath), (err) => {
      if (err) console.error(`Failed to delete file: ${filePath}`, err);
    });
  }
};

// Helper: generate Render picture URL
const getPictureUrl = (picturePath) => {
  if (!picturePath) return null;
  return `http://foodapp-backend-a3ew.onrender.com/Uploads/${path.basename(picturePath)}`;
};

// Create a seller notification
const createSellerNotification = async (req, res) => {
  try {
    const {
      requestType,
      name,
      cuisine,
      address,
      phone,
      email,
      tagline,
      timestamp,
      ownerName
    } = req.body;

    // Validate required fields
    if (!requestType || !name || !cuisine || !address || !phone || !email || !timestamp || !ownerName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Parse and validate address
    let addressObj;
    try {
      addressObj = typeof address === "string" ? JSON.parse(address) : address;
      if (!addressObj.street || !addressObj.city || !addressObj.state || !addressObj.zipCode) {
        return res.status(400).json({ success: false, message: "All address fields are required" });
      }
    } catch {
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    // Validate phone
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const picturePath = req.file ? req.file.path : null;
    const accessKey = Math.floor(1000 + Math.random() * 9000).toString();

    const notification = await Notification.create({
      requestType,
      name: name.trim(),
      cuisine: cuisine.trim(),
      address: addressObj,
      phone: phone.trim(),
      email: email.trim(),
      tagline: tagline?.trim(),
      picture: picturePath,
      accessKey,
      ownerName: ownerName.trim(),
      timestamp: new Date(timestamp),
      status: "pending"
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: {
        ...notification.toObject(),
        pictureUrl: getPictureUrl(notification.picture)
      }
    });

  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications.map(n => ({
        ...n.toObject(),
        pictureUrl: getPictureUrl(n.picture)
      }))
    });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      data: {
        ...notification.toObject(),
        pictureUrl: getPictureUrl(notification.picture)
      }
    });

  } catch (error) {
    console.error("Error retrieving notification by ID:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// Update notification status
const updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    // Handle new picture upload
    if (req.file) {
      if (notification.picture) {
        deleteImageFile(notification.picture);
      }
      notification.picture = req.file.path;
    }

    notification.status = status;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification status updated successfully",
      data: {
        ...notification.toObject(),
        pictureUrl: getPictureUrl(notification.picture)
      }
    });

  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// Delete rejected notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    if (notification.status !== "rejected") {
      return res.status(400).json({ success: false, message: "Only rejected notifications can be deleted" });
    }

    if (notification.picture) {
      deleteImageFile(notification.picture);
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Notification deleted successfully" });

  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

module.exports = {
  createSellerNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationStatus,
  deleteNotification
};
