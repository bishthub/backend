// transactionController.js
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');
const Transaction = require('../models/transactionModel');
const Notification = require('../models/notificationModel');
const { recordTransaction } = require('../utils/transactionUtils');

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

    res.status(201).json({ message: 'Transaction recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleName, amount, date } = req.query;

    const filters = {};
    if (moduleName) filters.moduleName = moduleName;
    if (amount) filters.amount = amount;
    if (date) filters.date = new Date(date);

    // Assume there is a 'createdAt' or 'date' field in your Transaction schema
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
      ...filters,
    })
      .sort({ date: -1 })
      .populate('from', 'username')
      .populate('to', 'username');

    const modifiedTransactions = transactions.map((transaction) => {
      const isSender = transaction.from._id.toString() === userId.toString();
      return {
        ...transaction.toObject(),
        transfer: isSender ? 'out' : 'in',
        username: isSender
          ? transaction.to.username
          : transaction.from.username,
      };
    });

    res.status(200).json(modifiedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createRecipientNotification = async (
  recipientUser,
  senderUser,
  tokens
) => {
  const notificationText = `You have received ${tokens} tokens from ${senderUser.username}`;
  const recipientNotification = new Notification({
    text: notificationText,
    type: 'Transfer',
  });
  await recipientNotification.save();
  recipientUser.notifications.push(recipientNotification);
  await recipientUser.save();
};

const createSenderNotification = async (senderUser, recipientUser, tokens) => {
  const notificationText = `You have sent ${tokens} tokens to ${recipientUser.username}`;
  const senderNotification = new Notification({
    text: notificationText,
    type: 'Transfer',
  });
  await senderNotification.save();
  senderUser.notifications.push(senderNotification);
  await senderUser.save();
};

exports.sendFund = async (req, res) => {
  try {
    const { username, chain, tokens } = req.body;
    const sender = req.user._id;
    const recipientUsername = username; // Assuming the sender is authenticated
    const recipientUser = await User.findOne({ username: recipientUsername });
    console.log('RECIPIENT USERNAME', recipientUser);
    // Find the sender's user and wallet
    const senderUser = await User.findById(sender);
    console.log('senderUser USERNAME', senderUser);
    if (senderUser.id == recipientUser.id)
      return res.status(400).send("Sender and recipient can't be the same");

    if (!senderUser) {
      return res.status(404).send('Sender user not found');
    }
    if (!recipientUser) {
      return res.status(404).send('Receipient user not found');
    }

    // const senderWallet = await Wallet.findOne({ userId: senderUser._id });

    // if (!senderWallet) {
    //   return res.status(404).send('Sender wallet not found');
    // }

    // // Check if the sender has enough tokens in the specified chain
    // const chainToUpdate = senderWallet.chains.find(
    //   (c) => c.chainName === chain
    // );
    // if (!chainToUpdate || chainToUpdate.tokens < tokens) {
    //   return res.status(400).send('Insufficient funds in the specified chain');
    // }

    // // Find the recipient's user and wallet
    // if (!recipientUser) {
    //   return res.status(404).send('Recipient user not found');
    // }

    // const recipientWallet = await Wallet.findOne({ userId: recipientUser._id });

    // if (!recipientWallet) {
    //   return res.status(404).send('Recipient wallet not found');
    // }

    // // Transfer tokens from sender to recipient in the specified chain
    // chainToUpdate.tokens -= tokens;
    // const recipientChain = recipientWallet.chains.find(
    //   (c) => c.chainName === chain
    // );

    // if (recipientChain) {
    //   recipientChain.tokens += tokens;
    // } else {
    //   recipientWallet.chains.push({ chainName: chain, tokens });
    // }

    // // Save the changes
    // await senderWallet.save();
    // await recipientWallet.save();

    // await recordTransaction({
    //   moduleName: 'Transfer',
    //   amount: tokens,
    //   chain,
    //   from: senderUser._id,
    //   to: recipientUser._id,
    // });

    // Create a notification for the recipient
    await createRecipientNotification(recipientUser, senderUser, tokens);

    // Create a notification for the sender
    await createSenderNotification(senderUser, recipientUser, tokens);

    // // Save the changes
    // await senderUser.save();

    res.status(200).send('Funds transferred successfully');
  } catch (error) {
    console.log('error', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.requestFunds = async (req, res) => {
  try {
    const { chain, tokens } = req.body;
    const recipientUsername = req.body.username;
    const senderUser = req.user._id;
    // Find the recipient's user
    const recipientUser = await User.findOne({ username: recipientUsername });
    if (!recipientUser) {
      return res.status(404).send('Recipient user not found');
    }
    const senderUserName = await User.findOne({ _id: senderUser });
    // Create a notification for the recipient
    const notificationText = `You have received a request from ${senderUserName.username} to send ${tokens} tokens in ${chain}`;
    const recipientNotification = new Notification({
      text: notificationText,
      type: 'Request',
    });
    await recipientNotification.save();

    // Add the notification to the recipient's notifications
    recipientUser.notifications.push(recipientNotification);

    // Save the changes
    await recipientUser.save();

    // Respond with success
    res.status(200).send('Funds request sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
