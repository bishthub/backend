const mongoose = require('mongoose');

const ChainSchema = new mongoose.Schema({
  chainName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Chain', ChainSchema);
