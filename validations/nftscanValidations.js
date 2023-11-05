// validation/nftscanValidation.js
const Joi = require('joi');

const schemas = {
  getuserData: {
    params: Joi.object({
      walletAddress: Joi.string().required().messages({
        'string.empty': `walletAddress cannot be an empty field`,
        'any.required': `walletAddress is a required field`,
      }),
    }),
    query: Joi.object({
      erc_type: Joi.string().valid('erc721', 'erc1155').default('erc721'),
      show_attribute: Joi.boolean().default(false),
      sort_field: Joi.string().allow('', null),
      sort_direction: Joi.string().allow('', null),
      limit: Joi.number().integer().default(100),
    }),
  },
  // ... other validation schemas for nftscanController can be added here as needed
};

module.exports = schemas;
