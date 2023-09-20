const Cart = require("../models/cartModel");

// Get the user's cart
async function getCart(req, res) {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update the user's cart
async function updateCart(req, res) {
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
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete the user's cart
async function deleteCart(req, res) {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    await Cart.deleteOne({ user: userId });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getCart, updateCart, deleteCart };
