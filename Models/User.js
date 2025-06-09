const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
    match: [
      /^(\+?\d{1,3}[- ]?)?\d{10}$/,
      "Please enter a valid phone number (e.g., +1234567890 or 123-456-7890)",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  createdAt: { type: Date, default: Date.now },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
