const User = require("../Models/User");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const upload = require("../Middleware/upload");

const UPLOADS_DIR = path.join(__dirname, "../Middleware/Uploads"); // Match upload.js

const createUser = asyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!username || !email || !phone || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
  const userExists = await User.findOne({ $or: [{ email }, { phone }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email, phone, or username");
  }
  const user = await User.create({ username, email, phone, password });

  if (user) {
    res.status(201).json({
      status: 201,
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email || !phone || !password) {
    res.status(400);
    throw new Error("Please provide email, phone number, and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (user.phone !== phone) {
    res.status(401);
    throw new Error("Phone number does not match the registered number");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  req.session.user = {
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profilePhotoUrl: user.profilePhotoUrl,
  };

  res.status(200).json({
    status: 200,
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    status: 200,
    count: users.length,
    users: users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
      createdAt: user.createdAt,
    })),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.profilePhotoPath && fs.existsSync(user.profilePhotoPath)) {
    try {
      fs.unlinkSync(user.profilePhotoPath);
      console.log(`Deleted file: ${user.profilePhotoPath}`);
    } catch (err) {
      console.error(`Failed to delete file: ${user.profilePhotoPath}`, err);
    }
  }

  await user.deleteOne();

  res.status(200).json({
    status: 200,
    message: "User deleted successfully",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  if (req.body.password) {
    user.password = req.body.password;
  }
  if (req.body.role) {
    user.role = req.body.role;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    status: 200,
    message: "User updated successfully",
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profilePhotoUrl: updatedUser.profilePhotoUrl,
    },
  });
});

const uploadProfilePhoto = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!req.file) {
    res.status(400);
    throw new Error("No photo uploaded");
  }

  const user = await User.findById(userId);
  if (!user) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log(`Cleaned up file: ${req.file.path}`);
    }
    res.status(404);
    throw new Error("User not found");
  }

  // Delete old photo if it exists
  if (user.profilePhotoPath && fs.existsSync(user.profilePhotoPath)) {
    try {
      fs.unlinkSync(user.profilePhotoPath);
      console.log(`Deleted old file: ${user.profilePhotoPath}`);
    } catch (err) {
      console.error(`Failed to delete old file: ${user.profilePhotoPath}`, err);
    }
  }

  user.profilePhotoPath = req.file.path;
  user.profilePhotoUrl = `/Uploads/${req.file.filename}`;
  await user.save();

  res.status(200).json({
    status: 200,
    message: "Profile photo uploaded successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
    },
  });
});

module.exports = { createUser, loginUser, getAllUsers, deleteUser, updateUser, uploadProfilePhoto };