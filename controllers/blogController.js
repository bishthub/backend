// blogController.js
const Blog = require('../models/blogModel');

exports.addBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    updates.forEach((update) => (blog[update] = req.body[update]));
    await blog.save();

    res.status(200).send(blog);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    res.status(200).send({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
