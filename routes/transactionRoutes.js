// transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const transactionValidations = require('../validations/transactionValidations');
const validate = require('../middleware/validate');

router.post(
  '/send-fund',
  authMiddleware,
  validate(transactionValidations.sendFundSchema),
  transactionController.sendFund
);
router.post(
  '/request-fund',
  authMiddleware,
  validate(transactionValidations.requestFundsSchema),
  transactionController.requestFunds
);
router.get(
  '/get-transactions',
  authMiddleware,
  validate(transactionValidations.getTransactionsSchema),
  transactionController.getTransactions
);

module.exports = router;
