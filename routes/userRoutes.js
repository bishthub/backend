const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const userValidations = require('../validations/userValidations');
const validate = require('../middleware/validate');

router.put(
  '/profile',
  authMiddleware,
  validate(userValidations.updateProfileSchema),
  userController.updateProfile
);
router.get('/profile/:id', userController.getProfile);
router.get('/leaderboard', userController.getLeaderboard);
router.get('/notifications', authMiddleware, userController.getNotifications);

module.exports = router;
