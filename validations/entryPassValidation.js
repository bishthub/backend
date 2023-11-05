// validation/entryPassValidation.js
const Joi = require('joi');

const schemas = {
  addEntryPass: Joi.object({
    name: Joi.string().required().messages({
      'string.empty': `Name cannot be an empty field`,
      'any.required': `Name is a required field`,
    }),
    chain: Joi.string().required().messages({
      'string.empty': `Chain cannot be an empty field`,
      'any.required': `Chain is a required field`,
    }),
    price: Joi.number().required().min(0).messages({
      'number.base': `Price must be a number`,
      'number.min': `Price cannot be less than {#limit}`,
      'any.required': `Price is a required field`,
    }),
    image_link: Joi.string().required().messages({
      'string.empty': `Image link cannot be an empty field`,
      'any.required': `Image link is a required field`,
    }),
    type: Joi.string().required().messages({
      'string.empty': `Type cannot be an empty field`,
      'any.required': `Type is a required field`,
    }),
    // additional fields can be added here if necessary
  }),
  updateEntryPass: Joi.object({
    name: Joi.string().messages({
      'string.empty': `Name cannot be an empty field`,
    }),
    chain: Joi.string().messages({
      'string.empty': `Chain cannot be an empty field`,
    }),
    price: Joi.number().min(0).messages({
      'number.base': `Price must be a number`,
      'number.min': `Price cannot be less than {#limit}`,
    }),
    image_link: Joi.string().messages({
      'string.empty': `Image link cannot be an empty field`,
    }),
    type: Joi.string().messages({
      'string.empty': `Type cannot be an empty field`,
    }),
    // additional fields can be added here if necessary
  }),
  // You can add more schemas here for any other operations that might need validation
};

module.exports = schemas;
