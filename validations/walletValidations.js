// validations/walletValidations.js

const Joi = require('joi');

const schemas = {
  addDefaultChainsSchema: Joi.object({
    chainName: Joi.string().required(),
  }),
  updateDefaultChainsSchema: Joi.object({
    chainId: Joi.string().required(),
    chainName: Joi.string().required(),
  }),

  addChainSchema: Joi.object({
    chainName: Joi.string().required(),
    walletAddress: Joi.string().required(),
    tokens: Joi.number().min(0),
    isPrimary: Joi.boolean().required(),
  }),

  updateChainSchema: Joi.object({
    chainId: Joi.string().required(),
    chainName: Joi.string().required(),
    walletAddress: Joi.string().required(),
    tokens: Joi.number().min(0).required(),
    isPrimary: Joi.boolean().required(),
  }),
};

module.exports = schemas;
