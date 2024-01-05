const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

router.post('/mintNFT', nftController.mintNFTbyOwner);
router.get('/issue-token', nftController.issueToken);
module.exports = router;
