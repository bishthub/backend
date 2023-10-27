const User = require("../models/userModel");
const Wallet = require("../models/walletModel");

// function spinJackpot() {
//   const randomNum = Math.floor(Math.random() * 100000) + 1;

//   if (randomNum <= 70000) return 100;
//  else if (randomNum <= 85000) return 250;
//   else if (randomNum <= 92987) return 500;
//   else if (randomNum <= 96987) return 1000;
//   else if (randomNum <= 98987) return 2500;
//  else if (randomNum <= 99987) return 5000;
//   else if (randomNum <= 99997) return 10000;
//   else return 50000;
// }

async function canSpin(userId) {
  const user = await User.findById(userId);
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

  // Filter out spins that are older than 24 hours
  user.spins = user.spins.filter((spin) => spin.timestamp > oneDayAgo);

  return user.spins.length < 3;
}

async function canJackpot(userId) {
  const user = await User.findById(userId);
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

  // Filter out spins that are older than 24 hours
  user.jackpots = user.jackpots.filter(
    (jackpot) => jackpot.timestamp > oneDayAgo
  );

  return user.jackpots.length < 10;
}

// exports.spin = async (req, res) => {
//    const userId = req.user._id;

//   if (!(await canSpin(userId))) {
//    return res
//       .status(400)
//      .send("You've reached the maximum spins for the last 24 hours");
//  }

//  const prize = spinJackpot();

// Fetch user's wallet and add tokens
//   const wallet = await Wallet.findOne({ userId: userId });
//   wallet.tokens += prize;
//   await wallet.save();

// Save spin timestamp for the user
//   const user = await User.findById(userId);
//   user.spins.push({ timestamp: new Date() });
//   await user.save();

//   res.send({ prize });
// };

const items = ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6", "Item7"];

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

  // const wallet = await Wallet.findOne({ userId: userId });
  // wallet.tokens += spinResult.reward;
  // await wallet.save();

  const user = await User.findById(userId);
  user.spins.push({ timestamp: new Date() });
  await user.save();

  res.send(spinResult);
};
exports.jackpotSpinner = async (req, res) => {
  const userId = req.user._id;

  if (!(await canJackpot(userId))) {
    return res
      .status(400)
      .send("You've reached the maximum spins for the last 24 hours");
  }

  const user = await User.findById(userId);
  user.jackpots.push({ timestamp: new Date() });
  await user.save();

  res.send({ canJackpots: true });
};

exports.getWalletDetails = async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });

  if (!wallet) {
    return res.status(404).send("Wallet not found");
  }

  res.send(wallet);
};

exports.canSpin = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!(await canSpin(userId))) {
      return res.status(400).json({
        canSpin: false,
        message: "You've reached the maximum spins for the last 24 hours",
      });
    } else {
      return res.status(200).json({
        canSpin: true,
        message: "You can Spin",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.canJackpot = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!(await canJackpot(userId))) {
      return res.status(400).json({
        canJackpot: false,
        message: "You've reached the maximum spins for the last 24 hours",
      });
    } else {
      return res.status(200).json({
        canJackpot: true,
        message: "You can win Jackpot",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.spinDone = async (req, res) => {
  try {
    const userId = req.user._id;
    const amountWon = req.body.amount;

    // Fetch user's wallet and add tokens
    const wallet = await Wallet.findOne({ userId: userId });
    const recipientChain = wallet.chains.find((c) => c.chainName === "Blazpay");

    if (recipientChain) {
      recipientChain.tokens += amountWon;
    } else {
      wallet.chains.push({ chainName: "Blazpay", tokens: amountWon });
    }
    wallet.totalTokens += amountWon;
    await wallet.save();

    // Add spin time
    const user = await User.findById(userId);
    user.spins.push({ timestamp: new Date() });
    await user.save();

    return res.status(200).json({
      user,
      message: "Spin saved successfully",
    });
  } catch {}
};

exports.jackpotDone = async (req, res) => {
  try {
    const userId = req.user._id;
    const amountWon = req.body.amount || 0;
    // Fetch user's wallet and add tokens
    const wallet = await Wallet.findOne({ userId: userId });
    const recipientChain = wallet.chains.find((c) => c.chainName === "Blazpay");
    if (recipientChain) {
      recipientChain.tokens += amountWon;
    } else {
      wallet.chains.push({ chainName: "Blazpay", tokens: amountWon });
    }
    wallet.totalTokens += amountWon;
    await wallet.save();
    // Add jackpot time
    const user = await User.findById(userId);
    user.jackpots.push({ timestamp: new Date() });
    await user.save();

    return res.status(200).json({
      user,
      message: "Jackpot saved successfully",
    });
  } catch {}
};
