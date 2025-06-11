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
      accessKey,
      ownerName
    } = req.body;

    // Basic required field validation
    if (
      !requestType ||
      !name ||
      !cuisine ||
      !address ||
      !phone ||
      !email ||
      !timestamp ||
      !accessKey ||
      !ownerName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Address field validation
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All address fields are required" });
    }

    // Phone format validation
    if (!/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number format" });
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Access key validation (must be a 4-digit number)
    if (!/^\d{4}$/.test(accessKey)) {
      return res
        .status(400)
        .json({ success: false, message: "Access key must be a 4-digit number" });
    }

    // Owner name validation
    if (typeof ownerName !== 'string' || ownerName.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Owner name is required" });
    }

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
      accessKey,
      ownerName,
      timestamp: new Date(timestamp),
      status: "pending"
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal server error"
    });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications
    });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal server error"
    });
  }
};

const updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    // Find and update notification
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
      data: notification
    });
  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal server error"
    });
  }
};

module.exports = {
  createSellerNotification,
  getAllNotifications,
  updateNotificationStatus
};
