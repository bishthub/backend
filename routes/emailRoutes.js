// emailRoutes.js
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const validate = require('../middleware/validate');
const emailValidation = require('../validations/emailValidation'); // Import the validation schemas

router.post(
  '/send-email',
  validate(emailValidation.sendEmail),
  async (req, res) => {
    try {
      const { name, email, subject, content } = req.body;
      await emailController.sendEmail(name, email, subject, content);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Email sending failed' });
    }
  }
);

module.exports = router;
