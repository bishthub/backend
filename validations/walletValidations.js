// validations/walletValidations.js

const Joi = require('joi');

const schemas = {
  addDefaultChainsSchema: Joi.object({
    chainName: Joi.string().required(),
    img: Joi.string().required(),
  }),
  updateDefaultChainsSchema: Joi.object({
    chainId: Joi.string().required(),
    img: Joi.string().required(),
    chainName: Joi.string().required(),
  }),

  addChainSchema: Joi.object({
    chainId: Joi.string().required(),
    walletAddress: Joi.string().required(),
    tokens: Joi.number().min(0),
    isPrimary: Joi.boolean().required(),
  }),

  updateChainSchema: Joi.object({
    chainName: Joi.string(),
    chainId: Joi.string().required(),
    walletAddress: Joi.string().required(),
    tokens: Joi.number().min(0),
    isPrimary: Joi.boolean().required(),
  }),
};

module.exports = schemas;
