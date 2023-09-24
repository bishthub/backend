const mongoose = require('mongoose');

const chainSchema = new mongoose.Schema({
  chainName: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
  },
  tokens: {
    type: Number,
    default: 0,
  },
});

const walletSchema = new mongoose.Schema({
  chains: [chainSchema], // Array of chains with their tokens
  totalTokens: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Middleware to calculate totalTokens before saving
walletSchema.pre('save', function (next) {
  this.totalTokens = this.chains.reduce((sum, chain) => sum + chain.tokens, 0);
  next();
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
