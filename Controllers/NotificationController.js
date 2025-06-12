const Notification = require("../Models/Notification");

const createSellerNotification = async (req, res) => {
  try {
    const {
      requestType,
      name,
      cuisine,
      address,
      phone,
      email,
      picture,
      tagline,
      timestamp,
      ownerName,
    } = req.body;

    // Validate required fields
    if (
      !requestType ||
      !name ||
      !cuisine ||
      !address ||
      !phone ||
      !email ||
      !timestamp ||
      !ownerName
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Address validation
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    // Phone format validation
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Owner name validation
    if (typeof ownerName !== "string" || ownerName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Owner name is required",
      });
    }

    // 🔐 Generate a random 4-digit access key
    const accessKey = Math.floor(1000 + Math.random() * 9000).toString();

    // Create new notification
    const notification = new Notification({
      requestType,
      name,
      cuisine,
      address,
      phone,
      email,
      picture,
      tagline,
      accessKey, // generated in backend
      ownerName,
      timestamp: new Date(timestamp),
      status: "pending",
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }
    const notification = await Notification.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification status updated successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
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
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error retrieving notification by ID:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
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
        message: "Notification not found",
      });
    }

    if (notification.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Only rejected notifications can be deleted",
      });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

module.exports = {
  createSellerNotification,
  getAllNotifications,
  updateNotificationStatus,
  getNotificationById,
  deleteNotification,
};
