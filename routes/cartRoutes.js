// cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const cartValidation = require('../validations/cartValidation');

// Get the user's cart
router.get('/', authMiddleware, cartController.getCart);

// Update the user's cart
router.post(
  '/',
  authMiddleware,
  validate(cartValidation.updateCart),
  cartController.updateCart
);

// Delete the user's cart
router.delete('/', authMiddleware, cartController.deleteCart);

router.post(
  '/complete-purchase',
  authMiddleware,
  cartController.completePurchase
);

module.exports = router;
