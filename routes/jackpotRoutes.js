const express = require("express");
const router = express.Router();
const jackpotController = require("../controllers/jackpotController");
const authMiddleware = require("../middleware/authMiddleware");

// Ensure the user is authenticated before accessing the jackpot routes
// router.use(authMiddleware);

router.post("/spinDone", authMiddleware, jackpotController.spinDone);
router.post("/jackpotDone", authMiddleware, jackpotController.jackpotDone);
router.get("/wallet/:id", authMiddleware, jackpotController.getWalletDetails);
router.post(
  "/jackpotItemsSpinner",
  authMiddleware,
  jackpotController.jackpotItemsSpinner
);
router.post(
  "/jackpotSpinner",
  authMiddleware,
  jackpotController.jackpotSpinner
);
router.get("/can-spin", authMiddleware, jackpotController.canSpin);
router.get("/can-jackpot", authMiddleware, jackpotController.canJackpot);

module.exports = router;
