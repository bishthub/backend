const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.put("/profile", authMiddleware, userController.updateProfile);
router.get("/profile/:id", userController.getProfile);

module.exports = router;
