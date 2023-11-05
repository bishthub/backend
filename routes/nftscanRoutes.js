const express = require('express');
const router = express.Router();
const nftscanController = require('../controllers/nftscanController');
const authMiddleware = require('../middleware/authMiddleware');
const nftscanValidations = require('../validations/nftscanValidations');
const validate = require('../middleware/validate');
// // Ensure the user is authenticated before accessing the jackpot routes
// router.use(authMiddleware);

// Define a route that uses the nftscan controller
router.get(
  '/user/:walletAddress',
  validate(nftscanValidations.getuserData.params, 'params'),
  validate(nftscanValidations.getuserData.query, 'query'),
  nftscanController.getuserData
);

module.exports = router;
