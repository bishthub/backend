// validations/userValidations.js

const Joi = require('joi');

const schemas = {
  updateProfileSchema: Joi.object({
    img_url: Joi.string().uri().optional(),
    fullName: Joi.string().trim().optional(),
    bio: Joi.string().trim().optional(),
    insta: Joi.string().trim().optional(),
    twitter: Joi.string().trim().optional(),
    linkedin: Joi.string().trim().optional(),
    discord: Joi.string().trim().optional(),
    telegram: Joi.string().trim().optional(),
  }),
};

module.exports = schemas;
