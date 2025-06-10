const User = require("../Models/User");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!username || !email || !phone || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email or phone number");
  }
  const user = await User.create({ username, email, phone, password });

  if (user) {
    res.status(201).json({
      status: 201,
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
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

  // Check password match
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
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password"); // Exclude password field for security
  res.status(200).json({
    status: 200,
    count: users.length,
    users,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.remove();

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
    },
  });
});




module.exports = { createUser, loginUser, getAllUsers, deleteUser, updateUser };
