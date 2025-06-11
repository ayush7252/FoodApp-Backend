const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    enum: ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'Other'],
    default: 'Other'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    unique: [true, 'This phone number is already registered with another restaurant'],
    sparse: true 
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    trim: true,
    unique: [true, 'This email is already registered with another restaurant']
  },
  picture: {
    type: String,
    required: false,
    trim: true
  },
  tagline: {
    type: String,
    trim: true,
    maxlength: [200, 'Tagline cannot exceed 200 characters']
  },
  accessKey: {
    type: String,
    required: [true, 'Access key is required'],
    unique: true,
    match: [/^\d{4}$/, 'Access key must be a 4-digit number'],
    index: true
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [50, 'Owner name cannot exceed 50 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);