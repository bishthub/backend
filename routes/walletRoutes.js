const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure the user is authenticated before accessing the jackpot routes

router.post('/add-chain', authMiddleware, walletController.addChain);
router.put('/update-chain', authMiddleware, walletController.updateChain);
router.delete(
  '/delete-chain/:chainId',
  authMiddleware,
  walletController.deleteChain
);
router.get('/', authMiddleware, walletController.getWalletDetails);

module.exports = router;
