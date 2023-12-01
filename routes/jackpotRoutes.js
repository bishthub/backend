const express = require('express');
const router = express.Router();
const jackpotController = require('../controllers/jackpotController');
const authMiddleware = require('../middleware/authMiddleware');
const jackpotValidations = require('../validations/jackpotValidations');
const validate = require('../middleware/validate');

// Ensure the user is authenticated before accessing the jackpot routes
// router.use(authMiddleware);

router.post(
  '/spinDone',
  authMiddleware,
  // validate(jackpotValidations.spinDone),
  jackpotController.spinDone
);
router.post(
  '/jackpotDone',
  authMiddleware,
  validate(jackpotValidations.jackpotDone),
  jackpotController.jackpotDone
);
router.get('/wallet/:id', authMiddleware, jackpotController.getWalletDetails);
router.post(
  '/jackpotItemsSpinner',
  authMiddleware,
  jackpotController.jackpotItemsSpinner
);
router.get('/can-spin', authMiddleware, jackpotController.canSpin);
router.get('/can-jackpot', authMiddleware, jackpotController.canJackpot);

module.exports = router;
