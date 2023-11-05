const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: Number, required: true },
  chain: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
