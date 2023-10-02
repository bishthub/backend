// transactionController.js
const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const Notification = require("../models/notificationModel");

exports.recordTransaction = async (req, res) => {
  try {
    const { moduleName, amount } = req.body;

    // Assuming you have the authenticated user's information
    const userId = req.user._id;

    const newTransaction = new Transaction({
      moduleName,
      amount,
    });

    await newTransaction.save();

    res.status(201).json({ message: "Transaction recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { moduleName, amount, date } = req.query;

    const filters = {};
    if (moduleName) filters.moduleName = moduleName;
    if (amount) filters.amount = amount;
    if (date) filters.date = new Date(date);

    const transactions = await Transaction.find(filters);

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sendFund = async (req, res) => {
  try {
    const { username, chain, tokens } = req.body;
    const sender = req.user._id;
    console.log(
      "🚀 ~ file: transactionController.js:49 ~ exports.sendFund= ~ user:",
      sender
    );
    // Find the sender's user and wallet
    const senderUser = await User.findById(sender);

    if (!senderUser) {
      return res.status(404).send("Sender user not found");
    }

    const senderWallet = await Wallet.findOne({ userId: senderUser._id });

    if (!senderWallet) {
      return res.status(404).send("Sender wallet not found");
    }

    // Check if the sender has enough tokens in the specified chain
    const chainToUpdate = senderWallet.chains.find(
      (c) => c.chainName === chain
    );
    if (!chainToUpdate || chainToUpdate.tokens < tokens) {
      return res.status(400).send("Insufficient funds in the specified chain");
    }

    // Find the recipient's user and wallet
    const recipientUsername = req.body.username; // Assuming the sender is authenticated
    console.log(
      "🚀 ~ file: transactionController.js:82 ~ exports.sendFund= ~ recipientUsername:",
      recipientUsername
    );

    const recipientUser = await User.findOne({ username: recipientUsername });
    if (!recipientUser) {
      return res.status(404).send("Recipient user not found");
    }

    const recipientWallet = await Wallet.findOne({ userId: recipientUser._id });
    if (!recipientWallet) {
      return res.status(404).send("Recipient wallet not found");
    }

    // Transfer tokens from sender to recipient in the specified chain
    chainToUpdate.tokens -= tokens;
    const recipientChain = recipientWallet.chains.find(
      (c) => c.chainName === chain
    );
    if (recipientChain) {
      recipientChain.tokens += tokens;
    } else {
      recipientWallet.chains.push({ chainName: chain, tokens });
    }

    // Save the changes
    await senderWallet.save();
    await recipientWallet.save();

    // Record the transaction
    const newTransaction = new Transaction({
      moduleName: "Transfer",
      amount: tokens,
    });
    await newTransaction.save();

    res.status(200).send("Funds transferred successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.requestFunds = async (req, res) => {
  try {
    const { chain, tokens } = req.body;
    const requesterUserId = req.user._id;
    const recipientUsername = req.body.username;

    // Find the recipient's user
    const recipientUser = await User.findOne({ username: recipientUsername });
    if (!recipientUser) {
      return res.status(404).send("Recipient user not found");
    }

    // Create a notification for the recipient
    const notificationText = `You have received a request from ${requesterUserId} to send ${tokens} tokens in ${chain}`;
    const recipientNotification = new Notification({ text: notificationText });
    await recipientNotification.save();

    // Add the notification to the recipient's notifications
    recipientUser.notifications.push(recipientNotification);

    // Save the changes
    await recipientUser.save();

    // Respond with success
    res.status(200).send("Funds request sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
