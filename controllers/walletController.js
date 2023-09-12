const Wallet = require('../models/walletModel');

exports.getWalletDetails = async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });

  if (!wallet) {
    return res.status(404).send('Wallet not found');
  }

  res.send(wallet);
};
