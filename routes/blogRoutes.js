// blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Add a new blog
router.post('/blogs', authMiddleware, adminMiddleware, blogController.addBlog);

// Get all blogs
router.get('/blogs', blogController.getAllBlogs);

// Update a blog by ID
router.patch(
  '/blogs/:id',
  authMiddleware,
  adminMiddleware,
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
