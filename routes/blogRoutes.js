// blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validate');
const blogValidation = require('../validations/blogValidation'); // Import the validation schemas

// Add a new blog
router.post(
  '/blogs',
  authMiddleware,
  adminMiddleware,
  validate(blogValidation.addBlog),
  blogController.addBlog
);

// Get all blogs
router.get('/blogs', blogController.getAllBlogs);

// Update a blog by ID
router.patch(
  '/blogs/:id',
  authMiddleware,
  adminMiddleware,
  validate(blogValidation.updateBlog),
  blogController.updateBlog
);

// Delete a blog by ID
router.delete(
  '/blogs/:id',
  authMiddleware,
  adminMiddleware,
  blogController.deleteBlog
);

module.exports = router;
