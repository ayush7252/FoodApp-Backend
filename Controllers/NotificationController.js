const fs = require("fs");
const path = require("path");
const Notification = require("../Models/Notification");

// Helper to delete image file
const deleteImageFile = (filePath) => {
  if (filePath) {
    fs.unlink(path.resolve(filePath), (err) => {
      if (err) console.error(`Failed to delete file: ${filePath}`, err);
    });
  }
};

// Helper to generate picture URL for Render
const getPictureUrl = (picturePath) => {
  if (!picturePath) return null;
  return `http://foodapp-backend-a3ew.onrender.com/Uploads/${path.basename(picturePath)}`;
};

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

    if (
      !requestType || !name || !cuisine || !address ||
      !phone || !email || !timestamp || !ownerName
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    let addressObj;
    try {
      addressObj = typeof address === 'string' ? JSON.parse(address) : address;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid address format"
      });
    }

    if (!addressObj.street || !addressObj.city || !addressObj.state || !addressObj.zipCode) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required"
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const picturePath = req.file ? req.file.path : null;
    const accessKey = Math.floor(1000 + Math.random() * 9000).toString();

    const notification = new Notification({
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

    await notification.save();

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
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
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
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const updateData = { status };

    if (req.file) {
      const existing = await Notification.findById(id);
      if (existing && existing.picture) {
        deleteImageFile(existing.picture);
      }
      updateData.picture = req.file.path;
    }

    const notification = await Notification.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

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
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    if (notification.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Only rejected notifications can be deleted"
      });
    }

    if (notification.picture) {
      deleteImageFile(notification.picture);
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

module.exports = {
  createSellerNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationStatus,
  deleteNotification
};
