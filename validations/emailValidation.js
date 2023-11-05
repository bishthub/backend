// validation/emailValidation.js
const Joi = require('joi');

const sendEmailSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().trim().required(),
  content: Joi.string().trim().required(),
});

const schemas = {
  sendEmail: sendEmailSchema,
};

module.exports = schemas;
