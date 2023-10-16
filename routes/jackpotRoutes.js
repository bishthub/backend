const express = require("express");
const router = express.Router();
const jackpotController = require("../controllers/jackpotController");
const authMiddleware = require("../middleware/authMiddleware");

// Ensure the user is authenticated before accessing the jackpot routes
// router.use(authMiddleware);

router.post("/spin", authMiddleware, jackpotController.spin);
router.get("/wallet/:id", authMiddleware, jackpotController.getWalletDetails);
router.post(
  "/jackpotItemsSpinner",
  authMiddleware,
  jackpotController.jackpotItemsSpinner
);
router.get("/can-spin", authMiddleware, jackpotController.canSpin);

module.exports = router;
