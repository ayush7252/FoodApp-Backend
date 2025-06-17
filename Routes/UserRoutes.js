const express = require("express");
const router = express.Router();
const fs = require("fs");
const upload = require("../Middleware/upload");
const {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  uploadProfilePhoto,
} = require("../Controllers/UserController");
const { sendEmail } = require("./EmailRoutes"); // Adjust path as needed

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management API
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 description: Unique email address
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 description: Unique phone number (10 digits)
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 description: Password (minimum 6 characters)
 *                 example: Password123
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile photo (JPEG, JPG, PNG, GIF, max 5MB)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 684fef14b6c13758c48a3375
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     role:
 *                       type: string
 *                       example: customer
 *                     profilePhotoUrl:
 *                       type: string
 *                       example: /Uploads/1234567890-123456789.jpg
 *       400:
 *         description: Bad request (missing/invalid fields or duplicates)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All required fields must be provided
 *       500:
 *         description: Internal server error
 */
router.post("/signup", upload.single("profilePhoto"), async (req, res, next) => {
  const { username, email, phone, password } = req.body;

  try {
    if (!username || !email || !phone || !password) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log(`Cleaned up file: ${req.file.path}`);
      }
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });
    if (existingUser) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log(`Cleaned up file: ${req.file.path}`);
      }
      return res.status(400).json({ error: "User with this email, phone, or username already exists" });
    }

    const userData = {
      username,
      email,
      phone,
      password,
      profilePhotoPath: req.file ? req.file.path : undefined,
      profilePhotoUrl: req.file ? `/Uploads/${req.file.filename}` : undefined,
    };

    const user = await User.create(userData);

    const emailData = {
      to: user.email,
      subject: "🎉 Welcome Aboard!",
      text: `Dear ${user.username},\n\nCongratulations on successfully creating your account with us!\n\nWe're excited to have you on our platform and look forward to serving you.\n\nIf you have any questions, feel free to reach out.\n\nCheers,\nAyush Kumar Singh \n Developer \n Contact: +91-7307585258`,
    };
    try {
      await sendEmail(emailData);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (emailErr) {
      console.error(`Failed to send welcome email to ${user.email}:`, emailErr);
    }

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhotoUrl: user.profilePhotoUrl,
      },
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log(`Cleaned up file: ${req.file.path}`);
    }
    next(err);
  }
});

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
 *                 description: Unique phone number (10 digits)
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 description: Password (minimum 6 characters)
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 _id:
 *                   type: string
 *                   example: 684fef14b6c13758c48a3375
 *                 username:
 *                   type: string
 *                   example: testuser
 *                 email:
 *                   type: string
 *                   example: test@example.com
 *                 phone:
 *                   type: string
 *                   example: 1234567890
 *                 role:
 *                   type: string
 *                   example: customer
 *                 profilePhotoUrl:
 *                   type: string
 *                   example: /Uploads/1234567890-123456789.jpg
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-17T12:00:00.000Z
 *       400:
 *         description: Bad request (missing/invalid fields or duplicates)
 */
router.post("/", createUser);

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
 *               - phone
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: test@example.com
 *               phone:
 *                 type: string
 *                 description: User phone number (10 digits)
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 684fef14b6c13758c48a3375
 *                     username:
 *                       type: string
 *                       example: testuser
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     role:
 *                       type: string
 *                       example: customer
 *                     profilePhotoUrl:
 *                       type: string
 *                       example: /Uploads/1234567890-123456789.jpg
 *       400:
 *         description: Bad request (missing fields)
 *       401:
 *         description: Unauthorized (invalid credentials)
 */
router.post("/login", loginUser);

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
 *                         example: 684fef14b6c13758c48a3375
 *                       username:
 *                         type: string
 *                         example: testuser
 *                       email:
 *                         type: string
 *                         example: test@example.com
 *                       phone:
 *                         type: string
 *                         example: 1234567890
 *                       role:
 *                         type: string
 *                         example: customer
 *                       profilePhotoUrl:
 *                         type: string
 *                         example: /Uploads/1234567890-123456789.jpg
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-17T12:00:00.000Z
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updateduser
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 684fef14b6c13758c48a3375
 *                     username:
 *                       type: string
 *                       example: updateduser
 *                     email:
 *                       type: string
 *                       example: updated@example.com
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     role:
 *                       type: string
 *                       example: admin
 *                     profilePhotoUrl:
 *                       type: string
 *                       example: /Uploads/1234567890-123456789.jpg
 *       404:
 *         description: User not found
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /api/users/{id}/photo:
 *   post:
 *     summary: Upload a profile photo for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo (JPEG, JPG, PNG, GIF, max 5MB)
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Profile photo uploaded successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 684fef14b6c13758c48a3375
 *                     username:
 *                       type: string
 *                       example: testuser
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     role:
 *                       type: string
 *                       example: customer
 *                     profilePhotoUrl:
 *                       type: string
 *                       example: /Uploads/1234567890-123456789.jpg
 *       400:
 *         description: Bad request (no photo uploaded)
 *       404:
 *         description: User not found
 */
router.post("/:id/photo", upload.single("profilePhoto"), uploadProfilePhoto);

module.exports = router;