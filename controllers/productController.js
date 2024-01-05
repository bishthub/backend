const Product = require('../models/productModel');
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const chainQuery = req.query.chain;
    let products;

    if (chainQuery) {
      products = await Product.find({ chain: chainQuery });
    } else {
      products = await Product.find();
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
