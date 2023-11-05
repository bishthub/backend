// validation/blogValidation.js
const Joi = require('joi');

const addBlogSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  link: Joi.string().uri().required(), // Validates a proper URI
});

const updateBlogSchema = Joi.object({
  name: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  link: Joi.string().uri().optional(), // Validates a proper URI
}).min(1); // At least one field must be present for the update to make sense

const schemas = {
  addBlog: addBlogSchema,
  updateBlog: updateBlogSchema,
};

module.exports = schemas;
