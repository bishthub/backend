const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  totalSwapCount: {
    type: Number,
    default: 0,
  },
  dailySwapCount: {
    type: Number,
    default: 0,
  },
  lastSwapDate: {
    type: Date,
    default: Date.now,
  },
});

const Swap = mongoose.model('Swap', SwapSchema);

module.exports = Swap;
