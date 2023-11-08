const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { questionSchema } = require('../validations/questionValidations');

// Admin endpoints
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(questionSchema),
  questionController.addQuestion
);
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(questionSchema),
  questionController.updateQuestion
);
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  questionController.deleteQuestion
);

// User endpoints
router.get('/', authMiddleware, questionController.getQuestions);
router.post('/answer', authMiddleware, questionController.answerQuestion);

module.exports = router;
