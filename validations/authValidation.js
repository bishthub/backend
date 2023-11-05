// validation/authValidation.js
const Joi = require('joi');

const register = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().required(), // Add regex as needed for validation
  password: Joi.string().min(6).required(),
  referralCode: Joi.string().length(7).optional(), // Assuming referral codes are 7 characters long
});

const login = Joi.object({
  loginField: Joi.string().required(), // Since this can be username, email, or mobile number, keep it simple
  password: Joi.string().required(),
});

const schemas = {
  register,
  login,
};

module.exports = schemas;
