// validation/jackpotValidation.js
const Joi = require('joi');

const schemas = {
  spinDone: Joi.object({
    amount: Joi.number().integer().min(0).required().messages({
      'number.base': `amount must be a number`,
      'number.min': `amount cannot be less than {#limit}`,
      'any.required': `amount is a required field`,
    }),
  }),
  jackpotDone: Joi.object({
    amount: Joi.number().integer().min(0).required().messages({
      'number.base': `amount must be a number`,
      'number.min': `amount cannot be less than {#limit}`,
      'any.required': `amount is a required field`,
    }),
  }),
};

module.exports = schemas;
