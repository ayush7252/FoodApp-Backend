const express = require('express');
const router = express.Router();
const {
  createSellerNotification,
  getAllNotifications,
  updateNotificationStatus,
} = require('../Controllers/NotificationController');

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
 *         application/json:
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
 *                 description: Type of request
 *                 example: seller_application
 *               name:
 *                 type: string
 *                 description: Restaurant name
 *                 example: Tasty Bistro
 *               cuisine:
 *                 type: string
 *                 description: Cuisine type
 *                 example: Italian
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - zipCode
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: 123 Main St
 *                   city:
 *                     type: string
 *                     example: New York
 *                   state:
 *                     type: string
 *                     example: NY
 *                   zipCode:
 *                     type: string
 *                     example: 10001
 *               phone:
 *                 type: string
 *                 description: 10-digit phone number
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 description: Valid email address
 *                 example: contact@tastybistro.com
 *               picture:
 *                 type: string
 *                 description: URL to restaurant picture (optional)
 *                 example: https://example.com/picture.jpg
 *               tagline:
 *                 type: string
 *                 description: Restaurant tagline (optional)
 *                 example: Delicious meals, made with love
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Request timestamp
 *                 example: 2025-06-11T10:43:00.000Z
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     requestType:
 *                       type: string
 *                       example: seller_application
 *                     name:
 *                       type: string
 *                       example: Tasty Bistro
 *                     cuisine:
 *                       type: string
 *                       example: Italian
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: 123 Main St
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         zipCode:
 *                           type: string
 *                           example: 10001
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     email:
 *                       type: string
 *                       example: contact@tastybistro.com
 *                     picture:
 *                       type: string
 *                       example: https://example.com/picture.jpg
 *                     tagline:
 *                       type: string
 *                       example: Delicious meals, made with love
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-11T10:43:00.000Z
 *                     status:
 *                       type: string
 *                       example: pending
 *       400:
 *         description: Bad request (missing/invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Missing required fields
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notifications retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       requestType:
 *                         type: string
 *                         example: seller_application
 *                       name:
 *                         type: string
 *                         example: Tasty Bistro
 *                       cuisine:
 *                         type: string
 *                         example: Italian
 *                       address:
 *                         type: object
 *                         properties:
 *                           street:
 *                             type: string
 *                             example: 123 Main St
 *                           city:
 *                             type: string
 *                             example: New York
 *                           state:
 *                             type: string
 *                             example: NY
 *                           zipCode:
 *                             type: string
 *                             example: 10001
 *                       phone:
 *                         type: string
 *                         example: 1234567890
 *                       email:
 *                         type: string
 *                         example: contact@tastybistro.com
 *                       picture:
 *                         type: string
 *                         example: https://example.com/picture.jpg
 *                       tagline:
 *                         type: string
 *                         example: Delicious meals, made with love
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-11T10:43:00.000Z
 *                       status:
 *                         type: string
 *                         example: pending
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
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
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
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
 *                 description: New status for the notification
 *                 example: approved
 *     responses:
 *       200:
 *         description: Notification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     requestType:
 *                       type: string
 *                       example: seller_application
 *                     name:
 *                       type: string
 *                       example: Tasty Bistro
 *                     cuisine:
 *                       type: string
 *                       example: Italian
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: 123 Main St
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         zipCode:
 *                           type: string
 *                           example: 10001
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     email:
 *                       type: string
 *                       example: contact@tastybistro.com
 *                     picture:
 *                       type: string
 *                       example: https://example.com/picture.jpg
 *                     tagline:
 *                       type: string
 *                       example: Delicious meals, made with love
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-11T10:43:00.000Z
 *                     status:
 *                       type: string
 *                       example: approved
 *       400:
 *         description: Bad request (invalid status)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid status value
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Notification not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/admin/notify', createSellerNotification);
router.get('/admin/notifications', getAllNotifications);
router.patch('/admin/notifications/:id', updateNotificationStatus);

module.exports = router;