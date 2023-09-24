const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  productController.addProduct
);
router.get("/all", productController.getAllProducts);
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;
