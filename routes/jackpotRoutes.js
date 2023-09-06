const express = require("express");
const router = express.Router();
const jackpotController = require("../controllers/jackpotController");
const authMiddleware = require("../middleware/authMiddleware");

// Ensure the user is authenticated before accessing the jackpot routes
router.use(authMiddleware);

router.post("/spin", jackpotController.spin);
router.get("/wallet", jackpotController.getWalletDetails);

module.exports = router;
