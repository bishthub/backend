const User = require('../models/userModel');
const Wallet = require('../models/walletModel');

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

const items = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6', 'Item7'];

function spinItems() {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

function spinItemsJackpot() {
  const item1 = spinItems();
  const item2 = spinItems();
  const item3 = spinItems();

  if (item1 === item2 && item2 === item3) {
    return { result: [item1, item2, item3], reward: 1000 };
  }

  return { result: [item1, item2, item3], reward: 0 };
}

exports.jackpotItemsSpinner = async (req, res) => {
  const userId = req.user._id;

  if (!(await canSpin(userId))) {
    return res
      .status(400)
      .send("You've reached the maximum spins for the last 24 hours");
  }

  const spinResult = spinItemsJackpot();

  const wallet = await Wallet.findOne({ userId: userId });
  wallet.tokens += spinResult.reward;
  await wallet.save();

  const user = await User.findById(userId);
  user.spins.push({ timestamp: new Date() });
  await user.save();

  res.send(spinResult);
};

exports.getWalletDetails = async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });

  if (!wallet) {
    return res.status(404).send('Wallet not found');
  }

  res.send(wallet);
};
