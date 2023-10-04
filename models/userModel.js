const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
  },
  spins: [
    {
      timestamp: Date,
    },
  ],
  role: {
    type: String,
    enum: ["admin", "staff", "member"],
    default: "admin",
  },
  img_url: { type: String },
  fullName: { type: String },
  bio: { type: String },
  insta: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  discord: { type: String },
  telegram: { type: String },
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
  isReferred: {
    type: Boolean,
    default: false,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
