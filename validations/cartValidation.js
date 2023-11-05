// validation/cartValidation.js
const Joi = require('joi');

const schemas = {
  updateCart: Joi.object({
    productId: Joi.string().required().messages({
      'string.empty': `Product ID cannot be an empty field`,
      'any.required': `Product ID is a required field`,
    }),
    quantity: Joi.number().integer().min(0).required().messages({
      'number.base': `Quantity must be a number`,
      'number.min': `Quantity cannot be less than {#limit}`,
      'any.required': `Quantity is a required field`,
    }),
    // additional validation rules can be added here if needed
  }),
  // More schemas can be added here if needed for other operations
};

module.exports = schemas;
