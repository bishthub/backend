const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Wallet = require("../models/walletModel");

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

    // If both checks pass, proceed to register the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const wallet = new Wallet({
      userId: user._id,
    });

    await wallet.save();

    // Link user to the wallet
    user.walletId = wallet._id;
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send("Invalid credentials");
  }

  const token = jwt.sign({ _id: user._id, role: user.role }, "YOUR_SECRET", {
    expiresIn: "30m",
  });
  res.send(token);
};

exports.dashboard = (req, res) => {
  res.send("Dashboard Content");
};
