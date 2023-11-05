// validations/transactionValidations.js
const Joi = require('joi');

const schemas = {
  recordTransactionSchema: Joi.object({
    moduleName: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }),
  getTransactionsSchema: Joi.object({
    moduleName: Joi.string().optional(),
    amount: Joi.number().positive().optional(),
    date: Joi.date().optional(),
  }),
  sendFundSchema: Joi.object({
    username: Joi.string().required(),
    chain: Joi.string().required(),
    tokens: Joi.number().positive().required(),
  }),
  requestFundsSchema: Joi.object({
    username: Joi.string().required(),
    chain: Joi.string().required(),
    tokens: Joi.number().positive().required(),
  }),
};

module.exports = schemas;
