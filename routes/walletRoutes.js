const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public route
router.get('/get-default-chains', walletController.getDefaultChains);
// Ensure the user is authenticated before accessing the jackpot routes
router.use(authMiddleware);

router.post('/add-chain', walletController.addChain);
router.put('/update-chain', walletController.updateChain);
router.delete('/delete-chain/:chainId', walletController.deleteChain);
router.get('/', walletController.getWalletDetails);

router.post(
  '/add-default-chains',
  adminMiddleware,
  walletController.addDefaultChains
);
router.put(
  '/update-default-chains',
  adminMiddleware,
  walletController.updateDefaultChains
);
router.delete(
  '/delete-default-chains/:chainId',
  adminMiddleware,
  walletController.deleteDefaultChains
);

module.exports = router;
