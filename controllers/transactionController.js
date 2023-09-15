// transactionController.js
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');

exports.sendFund = async (req, res) => {
  try {
    const { username, chain, tokens } = req.body;

    // Find the sender's user and wallet
    const senderUser = await User.findOne({ username });
    if (!senderUser) {
      return res.status(404).send('Sender user not found');
    }

    const senderWallet = await Wallet.findOne({ userId: senderUser._id });
    if (!senderWallet) {
      return res.status(404).send('Sender wallet not found');
    }

    // Check if the sender has enough tokens in the specified chain
    const chainToUpdate = senderWallet.chains.find(
      (c) => c.chainName === chain
    );
    if (!chainToUpdate || chainToUpdate.tokens < tokens) {
      return res.status(400).send('Insufficient funds in the specified chain');
    }

    // Find the recipient's user and wallet
    const recipientUsername = req.user.username; // Assuming the sender is authenticated
    const recipientUser = await User.findOne({ username: recipientUsername });
    if (!recipientUser) {
      return res.status(404).send('Recipient user not found');
    }

    const recipientWallet = await Wallet.findOne({ userId: recipientUser._id });
    if (!recipientWallet) {
      return res.status(404).send('Recipient wallet not found');
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

    res.status(200).send('Funds transferred successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.receiveFund = async (req, res) => {
  try {
    const { chain, tokens, username } = req.body;

    // Notify the recipient user (you can implement a notification mechanism here)
    // For demonstration purposes, we'll just send a success response
    res
      .status(200)
      .send(`You have received ${tokens} tokens in ${chain} from ${username}`);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
