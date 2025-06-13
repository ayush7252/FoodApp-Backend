const express = require("express");
const router = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAccessKeyByEmail,
  getRestaurantByAccessKey
} = require("../Controllers/ResturantController");

/**
 * @swagger
 * tags:
 *   - name: Restaurants
 *     description: Restaurant management API
 */

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               -               - cuisine
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the restaurant
 *                 example: Cafe Mocha
 *               cuisine:
 *                 type: string
 *                 description: Type of cuisine
 *                 example: Italian
 *               address:
 *                 type: object
 *                 description: Restaurant address
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
 *                 description: Contact phone number (10 digits)
 *                 example: 1234567890
 *               rating:
 *                 type: number
 *                 description: Restaurant rating (0-5)
 *                 example: 4.5
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Cafe Mocha
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
 *                     rating:
 *                       type: number
 *                       example: 4.5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-09T12:00:00.000Z
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
 *                 error:
 *                   type: string
 *                   example: Please provide all required fields
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       name:
 *                         type: string
 *                         example: Cafe Mocha
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
 *                       rating:
 *                         type: number
 *                         example: 4.5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-09T12:00:00.000Z
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Cafe Mocha
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
 *                     rating:
 *                       type: number
 *                       example: 4.5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-09T12:00:00.000Z
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Restaurant not found
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant ID
 *     requestBody:
 *       description: Fields to update (name, cuisine, address, phone, rating)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Cafe
 *               cuisine:
 *                 type: string
 *                 example: Mexican
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: 456 Oak St
 *                   city:
 *                     type: string
 *                     example: Los Angeles
 *                   state:
 *                     type: string
 *                     example: CA
 *                   zipCode:
 *                     type: string
 *                     example: 90001
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               rating:
 *                 type: number
 *                 example: 4.8
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Updated Cafe
 *                     cuisine:
 *                       type: string
 *                       example: Mexican
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: 456 Oak St
 *                         city:
 *                           type: string
 *                           example: Los Angeles
 *                         state:
 *                           type: string
 *                           example: CA
 *                         zipCode:
 *                           type: string
 *                           example: 90001
 *                     phone:
 *                       type: string
 *                       example: 9876543210
 *                     rating:
 *                       type: number
 *                       example: 4.8
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-09T12:00:00.000Z
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Restaurant not found
 *       400:
 *         description: Bad request (invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid input data
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Restaurant not found
 */

/**
 * @swagger
 * /api/restaurants/get-accesskey-by-email:
 *   post:
 *     summary: Get access key by registered email
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@restaurant.com
 *     responses:
 *       200:
 *         description: Access key fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessKey:
 *                   type: string
 *                   example: "4923"
 *       400:
 *         description: Missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Email is required
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Restaurant with this email not found
 */

router.post("/", createRestaurant);
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurant);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.post("/get-accesskey-by-email", getAccessKeyByEmail);
router.get('/by-access-key/:accessKey', getRestaurantByAccessKey);

module.exports = router;