// transactionRoutes.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send-fund", authMiddleware, transactionController.sendFund);
router.post(
  "/request-fund",
  authMiddleware,
  transactionController.requestFunds
);
router.get(
  "/get-transactions",
  authMiddleware,
  transactionController.getTransactions
);

module.exports = router;
