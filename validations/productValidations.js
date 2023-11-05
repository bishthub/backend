// validation/productValidation.js
const Joi = require('joi');

const schemas = {
  addProduct: Joi.object({
    title: Joi.string().required(),
    img: Joi.string().required(),
    price: Joi.number().precision(2).required(),
    description: Joi.string().required(),
    chain: Joi.string().required(),
    quantity: Joi.number().integer().required(),
  }),
  updateProduct: Joi.object({
    title: Joi.string(),
    img: Joi.string(),
    price: Joi.number().precision(2),
    description: Joi.string(),
    chain: Joi.string(),
    quantity: Joi.number().integer(),
  }),
  // You can add other schemas here for different operations if needed.
};

module.exports = schemas;
