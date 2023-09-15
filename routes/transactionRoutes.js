// transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Send funds to a user
router.post('/send-fund', authMiddleware, transactionController.sendFund);

// Receive funds from a user
router.post('/receive-fund', authMiddleware, transactionController.receiveFund);

module.exports = router;
