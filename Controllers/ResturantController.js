const Restaurant = require('../Models/Resturant');

// Helper function to generate a random 4-digit number
const generateAccessKey = () => {
  return Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
};

// Helper function to generate a unique access key
const getUniqueAccessKey = async () => {
  let accessKey;
  let isUnique = false;
  const maxAttempts = 10; // Prevent infinite loops

  for (let i = 0; i < maxAttempts; i++) {
    accessKey = generateAccessKey();
    const existingRestaurant = await Restaurant.findOne({ accessKey });
    if (!existingRestaurant) {
      isUnique = true;
      break;
    }
  }

  if (!isUnique) {
    throw new Error('Unable to generate a unique access key after multiple attempts');
  }

  return accessKey;
};

// Create a new restaurant
const createRestaurant = async (req, res) => {
  try {
    // Generate a unique access key
    const accessKey = await getUniqueAccessKey();

    // Add accessKey to the request body
    const restaurantData = {
      ...req.body,
      accessKey
    };

    const restaurant = await Restaurant.create(restaurantData);
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key errors
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `This ${field} is already registered with another restaurant`
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single restaurant by ID
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update a restaurant
const updateRestaurant = async (req, res) => {
  try {
    // Prevent updating accessKey
    if (req.body.accessKey) {
      delete req.body.accessKey;
    }
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key errors
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `This ${field} is already registered with another restaurant`
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { createRestaurant, getAllRestaurants, getRestaurant, updateRestaurant, deleteRestaurant };