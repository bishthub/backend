// entryPassRoutes.js
const express = require('express');
const router = express.Router();
const entryPassController = require('../controllers/entryPassController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Add a new Entry Pass
router.post(
  '/entry-passes',
  authMiddleware,
  adminMiddleware,
  entryPassController.addEntryPass
);

// Get all Entry Passes
router.get(
  '/entry-passes',
  authMiddleware,
  adminMiddleware,
  entryPassController.getAllEntryPasses
);

// Update an Entry Pass by ID
router.patch(
  '/entry-passes/:id',
  authMiddleware,
  adminMiddleware,
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
