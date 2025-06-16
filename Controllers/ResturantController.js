const Restaurant = require('../Models/Resturant');

// Create a new restaurant
const createRestaurant = async (req, res) => {
  try {
    const { accessKey } = req.body;

    if (!accessKey) {
      return res.status(400).json({
        success: false,
        error: 'Access key is required'
      });
    }

    // Check if accessKey is unique
    const existingAccessKey = await Restaurant.findOne({ accessKey });
    if (existingAccessKey) {
      return res.status(400).json({
        success: false,
        error: 'Access key already exists. Please provide a unique access key.'
      });
    }

    const restaurant = await Restaurant.create(req.body);

    // Build pictureUrl
    let pictureUrl = null;
    if (restaurant.picture) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      pictureUrl = `${baseUrl}/Uploads/${restaurant.picture.split('/').pop()}`;
    }

    res.status(201).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        pictureUrl
      }
    });

  } catch (error) {
    if (error.code === 11000) {
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

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const updatedRestaurants = restaurants.map(r => {
      let pictureUrl = null;
      if (r.picture) {
        pictureUrl = `${baseUrl}/Uploads/${r.picture.split('/').pop()}`;
      }
      return {
        ...r.toObject(),
        pictureUrl
      };
    });

    res.status(200).json({
      success: true,
      count: updatedRestaurants.length,
      data: updatedRestaurants
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

    let pictureUrl = null;
    if (restaurant.picture) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      pictureUrl = `${baseUrl}/Uploads/${restaurant.picture.split('/').pop()}`;
    }

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        pictureUrl
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a restaurant by accessKey
const getRestaurantByAccessKey = async (req, res) => {
  try {
    const { accessKey } = req.params;


    if (!accessKey) {
      return res.status(400).json({
        success: false,
        error: 'Access key is required'
      });
    }

    aaccessKey = accessKey.toString();

    const restaurant = await Restaurant.findOne({ accessKey });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant with this access key not found'
      });
    }

    let pictureUrl = null;
    if (restaurant.picture) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      pictureUrl = `${baseUrl}/Uploads/${restaurant.picture.split('/').pop()}`;
    }

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        pictureUrl
      }
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
    if (req.body.accessKey) {
      delete req.body.accessKey; // Prevent updating accessKey
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

    let pictureUrl = null;
    if (restaurant.picture) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      pictureUrl = `${baseUrl}/Uploads/${restaurant.picture.split('/').pop()}`;
    }

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        pictureUrl
      }
    });

  } catch (error) {
    if (error.code === 11000) {
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

// Get access key by email
const getAccessKeyByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant with this email not found'
      });
    }

    res.status(200).json({
      success: true,
      accessKey: restaurant.accessKey
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAccessKeyByEmail,
  getRestaurantByAccessKey
};
