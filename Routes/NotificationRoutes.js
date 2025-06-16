const express = require("express");
const router = express.Router();
const {
  createSellerNotification,
  getAllNotifications,
  updateNotificationStatus,
  getNotificationById,
  deleteNotification,
} = require("../Controllers/NotificationController");
const upload = require("../Middleware/upload");

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Seller notification management API
 */

/**
 * @swagger
 * /admin/notify:
 *   post:
 *     summary: Create a new seller notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - requestType
 *               - name
 *               - cuisine
 *               - address
 *               - phone
 *               - email
 *               - timestamp
 *             properties:
 *               requestType:
 *                 type: string
 *                 example: seller_application
 *               name:
 *                 type: string
 *                 example: Tasty Bistro
 *               cuisine:
 *                 type: string
 *                 example: Italian
 *               address:
 *                 type: string
 *                 description: JSON stringified address
 *                 example: '{"street":"123 Main St","city":"New York","state":"NY","zipCode":"10001"}'
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: contact@tastybistro.com
 *               tagline:
 *                 type: string
 *                 example: Delicious meals, made with love
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-11T10:43:00.000Z
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Bad request (missing/invalid fields or file upload error)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: List of all notifications
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/notifications/{id}:
 *   patch:
 *     summary: Update notification status by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Notification status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/notifications/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /admin/notifications/{id}:
 *   delete:
 *     summary: Delete a rejected notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       400:
 *         description: Only rejected notifications can be deleted
 *       404:
 *         description: Notification not found
 */

// ROUTES
router.post("/admin/notify", (req, res, next) => {
  console.log("Received request to /admin/notify");
  upload.single("picture")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
      console.error("Upload error:", err.message);
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    }
    console.log("File upload processed:", req.file ? req.file.filename : "No file uploaded");
    // Proceed to controller even if no file is uploaded (assuming picture is optional)
    createSellerNotification(req, res, next);
  });
});

router.get("/admin/notifications", getAllNotifications);
router.patch("/admin/notifications/:id", updateNotificationStatus);
router.get("/admin/notifications/:id", getNotificationById);
router.delete("/admin/notifications/:id", deleteNotification);

module.exports = router;