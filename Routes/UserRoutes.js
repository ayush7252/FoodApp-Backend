const express = require('express');
const router = express.Router();
const { createUser, loginUser, getAllUsers } = require('../Controllers/UserController');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management API
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username
 *                 example: testuser
 *               email:
 *                 type: string
 *                 description: Unique email address
 *                 example: test@example.com
 *               phone:
 *                 type: string
 *                 description: Unique phone number (10-15 digits, optional +, spaces, or hyphens)
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 description: Password (minimum 6 characters)
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                   example: 507f1f77bcf86cd799439011
 *                 username:
 *                   type: string
 *                   example: testuser
 *                 email:
 *                   type: string
 *                   example: test@example.com
 *                 phone:
 *                   type: string
 *                   example: +1234567890
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-09T12:00:00.000Z
 *       400:
 *         description: Bad request (missing/invalid fields or duplicates)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please provide all required fields
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     username:
 *                       type: string
 *                       example: testuser
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *                     phone:
 *                       type: string
 *                       example: +1234567890
 *       400:
 *         description: Bad request (missing fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please provide email and password
 *       401:
 *         description: Unauthorized (invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       username:
 *                         type: string
 *                         example: testuser
 *                       email:
 *                         type: string
 *                         example: test@example.com
 *                       phone:
 *                         type: string
 *                         example: +1234567890
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-09T12:00:00.000Z
 */

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);

module.exports = router;
