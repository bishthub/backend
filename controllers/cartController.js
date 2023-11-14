const Cart = require('../models/cartModel');
const { recordTransaction } = require('../utils/transactionUtils');

// Get the user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const cart = await Cart.findOne({ user: userId }).populate(
      'items.productId'
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update the user's cart
exports.updateCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const { productId, quantity } = req.body;

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete the user's cart
exports.deleteCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    await Cart.deleteOne({ user: userId });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.completePurchase = async (req, res) => {
  try {
    const userId = req.user._id;
    const amountRedeemed = req.body.amount || 0;
    // Fetch user's wallet and add tokens
    await recordTransaction({
      moduleName: 'Purchase',
      amount: amountRedeemed,
      chain: 'arbitrum',
      from: userId,
      to: '6552a17a38e77523a012d3e5',
    });

    return res.status(200).json({
      message: 'Purchase Successful',
    });
  } catch (e) {
    console.log('ERR', e);
  }
};
