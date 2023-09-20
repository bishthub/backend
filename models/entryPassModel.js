// entryPassModel.js
const mongoose = require("mongoose");

const entryPassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  chain: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image_link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const EntryPass = mongoose.model("EntryPass", entryPassSchema);

module.exports = EntryPass;
