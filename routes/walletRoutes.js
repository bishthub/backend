const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const walletValidations = require('../validations/walletValidations');
const validate = require('../middleware/validate');

// Public route
router.get('/get-default-chains', walletController.getDefaultChains);
// Ensure the user is authenticated before accessing the jackpot routes
router.use(authMiddleware);

router.post(
  '/add-chain',
  validate(walletValidations.addChainSchema),
  walletController.addChain
);
router.put(
  '/update-chain',
  validate(walletValidations.updateChainSchema),
  walletController.updateChain
);
router.delete('/delete-chain/:chainId', walletController.deleteChain);

router.get('/', walletController.getWalletDetails);
router.get('/getWalletandNFTDetails', walletController.getWalletandNFTDetails);
router.get('/username', walletController.getWalletByUsername);
router.post(
  '/add-default-chains',
  adminMiddleware,
  validate(walletValidations.addDefaultChainsSchema),
  walletController.addDefaultChains
);
router.put(
  '/update-default-chains',
  adminMiddleware,
  validate(walletValidations.updateDefaultChainsSchema),
  walletController.updateDefaultChains
);
router.delete(
  '/delete-default-chains/:chainId',
  adminMiddleware,
  walletController.deleteDefaultChains
);

module.exports = router;
