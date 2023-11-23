// validation/authValidation.js
const Joi = require('joi');

const register = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  ethereumAddress: Joi.string().required(),
  referralCode: Joi.string().length(7).optional(), // Assuming referral codes are 7 characters long
});

const login = Joi.object({
  ethereumAddress: Joi.string().required(),
});

const schemas = {
  register,
  login,
};

module.exports = schemas;
