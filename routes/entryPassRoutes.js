// entryPassRoutes.js
const express = require('express');
const router = express.Router();
const entryPassController = require('../controllers/entryPassController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validate');
const entryPassValidation = require('../validations/entryPassValidation');

// Add a new Entry Pass
router.post(
  '/entry-passes',
  authMiddleware,
  adminMiddleware,
  validate(entryPassValidation.addEntryPass),
  entryPassController.addEntryPass
);

// Get all Entry Passes
router.get('/entry-passes', entryPassController.getAllEntryPasses);

// Update an Entry Pass by ID
router.patch(
  '/entry-passes/:id',
  authMiddleware,
  adminMiddleware,
  validate(entryPassValidation.updateEntryPass),
  entryPassController.updateEntryPass
);

// Delete an Entry Pass by ID
router.delete(
  '/entry-passes/:id',
  authMiddleware,
  adminMiddleware,
  entryPassController.deleteEntryPass
);

module.exports = router;
