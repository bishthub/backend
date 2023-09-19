// cartController.js
const User = require('../models/userModel');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'cart.items.productId'
    );
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the product is already in the cart
    console.log('HERE', user);
    const existingCartItem = user.cart.items.find((item) =>
      item.productId.equals(productId)
    );

    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      existingCartItem.quantity = quantity;
    } else {
      // Add a new item to the cart if not already present
      user.cart.items.push({ productId, quantity });
    }

    await user.save();

    res.status(200).send('Cart updated successfully');
  } catch (error) {
    console.log('error', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Clear the cart by setting the items array to an empty array
    user.cart.items = [];

    await user.save();

    res.status(200).send('Cart deleted successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
