const User = require("../models/userModel");
const Wallet = require("../models/walletModel");

function spinJackpot() {
  const randomNum = Math.floor(Math.random() * 100000) + 1;

  if (randomNum <= 70000) return 100;
  else if (randomNum <= 85000) return 250;
  else if (randomNum <= 92987) return 500;
  else if (randomNum <= 96987) return 1000;
  else if (randomNum <= 98987) return 2500;
  else if (randomNum <= 99987) return 5000;
  else if (randomNum <= 99997) return 10000;
  else return 50000;
}

async function canSpin(userId) {
  const user = await User.findById(userId);
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

  // Filter out spins that are older than 24 hours
  user.spins = user.spins.filter((spin) => spin.timestamp > oneDayAgo);

  return user.spins.length < 10;
}

exports.spin = async (req, res) => {
  const userId = req.user._id;

  if (!(await canSpin(userId))) {
    return res
      .status(400)
      .send("You've reached the maximum spins for the last 24 hours");
  }

  const prize = spinJackpot();

  // Fetch user's wallet and add tokens
  const wallet = await Wallet.findOne({ userId: userId });
  wallet.tokens += prize;
  await wallet.save();

  // Save spin timestamp for the user
  const user = await User.findById(userId);
  user.spins.push({ timestamp: new Date() });
  await user.save();

  res.send({ prize });
};

exports.getWalletDetails = async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });

  if (!wallet) {
    return res.status(404).send("Wallet not found");
  }

  res.send(wallet);
};
