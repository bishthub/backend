const express = require('express');
const router = express.Router();
const nftscanController = require('../controllers/nftscanController');
const authMiddleware = require('../middleware/authMiddleware');

// // Ensure the user is authenticated before accessing the jackpot routes
// router.use(authMiddleware);

// Define a route that uses the nftscan controller
router.get('/get-user-data/:walletAddress', nftscanController.getuserData);

module.exports = router;
