const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const productValidation = require('../validations/productValidations');
const validate = require('../middleware/validate');

router.post(
  '/add',
  authMiddleware,
  adminMiddleware,
  validate(productValidation.addProduct),
  productController.addProduct
);
router.get('/all', productController.getAllProducts);
router.put(
  '/update/:id',
  authMiddleware,
  adminMiddleware,
  validate(productValidation.updateProduct),
  productController.updateProduct
);
router.delete(
  '/delete/:id',
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;
