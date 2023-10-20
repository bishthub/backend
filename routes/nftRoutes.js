const express = require("express");
const router = express.Router();
const nftController = require("../controllers/nftController");

router.post("/mintNFT", nftController.mintNFTbyOwner);

module.exports = router;
