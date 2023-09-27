const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");

// Ensure the user is authenticated before accessing the jackpot routes
router.use(authMiddleware);

router.post("/add-chain", walletController.addChain);
router.put("/update-chain", walletController.updateChain);
router.delete("/delete-chain/:chainId", walletController.deleteChain);
router.get("/", walletController.getWalletDetails);

module.exports = router;
