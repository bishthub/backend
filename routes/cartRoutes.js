// cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Get the user's cart
router.get('/', authMiddleware, cartController.getCart);

// Update the user's cart
router.post('/', authMiddleware, cartController.updateCart);

// Delete the user's cart
router.delete('/', authMiddleware, cartController.deleteCart);

module.exports = router;
