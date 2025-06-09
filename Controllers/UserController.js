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
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (!(await user.matchPassword(password))) {
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
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  });
});

module.exports = { createUser, loginUser };
