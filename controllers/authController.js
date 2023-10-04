const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Wallet = require("../models/walletModel");
let nanoid;

const loadDependencies = async () => {
  ({ nanoid } = await import("nanoid"));
};

exports.register = async (req, res) => {
  try {
    // Check if username is taken
    const userWithSameUsername = await User.findOne({
      username: req.body.username,
    });
    if (userWithSameUsername) {
      return res.status(400).send("Username is already registered");
    }

    // Check if email is taken
    const userWithSameEmail = await User.findOne({ email: req.body.email });
    if (userWithSameEmail) {
      return res.status(400).send("Email is already registered");
    }

    // Check if mobile number is taken
    const userWithSameMobileNumber = await User.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (userWithSameMobileNumber) {
      return res.status(400).send("Mobile number is already registered");
    }
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      password: hashedPassword,
    });

    user.referralCode = nanoid(7);
    console.log(
      "🚀 ~ file: authController.js:42 ~ exports.register= ~ referralCode:",
      referralCode
    );

    // Check for referral
    if (req.body.referralCode) {
      const referringUser = await User.findOne({
        referralCode: req.body.referralCode,
      });
      if (!referringUser) {
        return res.status(400).json({ error_msg: "Invalid referral code" });
      }
      // Add referring user's id and set isReferred to true
      user.referredBy = referringUser._id;
      user.isReferred = true;
    }

    // If all checks pass, proceed to register the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const wallet = new Wallet({
      userId: user._id,
    });

    await wallet.save();

    // Link user to the wallet
    user.walletId = wallet._id;
    console.log("USER", user);
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  const { loginField, password } = req.body;

  // Check if the loginField is an email, username, or mobile number
  const user = await User.findOne({
    $or: [
      { email: loginField },
      { username: loginField },
      { mobileNumber: loginField },
    ],
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid credentials");
  }

  const token = jwt.sign({ _id: user._id, role: user.role }, "YOUR_SECRET", {
    expiresIn: "30m",
  });
  const userdata = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  res.json({ token, user: userdata });
};

exports.dashboard = (req, res) => {
  res.send("Dashboard Content");
};
