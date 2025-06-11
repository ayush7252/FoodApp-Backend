const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String }
});

const NotificationSchema = new mongoose.Schema({
  requestType: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete'], // You can adjust this enum based on request types
  },
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
    type: AddressSchema
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    trim: true
  },
  picture: {
    type: String,
    required: false,
    trim: true
  },
  tagline: {
    type: String,
    required: false,
    trim: true,
    maxlength: [200, 'Tagline cannot exceed 200 characters']
  },
  accessKey: {
    type: String,
    required: [true, 'Access key is required'],
    match: [/^\d{4}$/, 'Access key must be a 4-digit number']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [50, 'Owner name cannot exceed 50 characters']
  },
  timestamp: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
