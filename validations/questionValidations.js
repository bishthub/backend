const Joi = require('joi');

const questionSchema = Joi.object({
  questionText: Joi.string().required(),
  questionNumber: Joi.number(),
  options: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        blockchainNumber: Joi.number(),
        count: Joi.number().integer().min(0),
      })
    )
    .max(4),
  totalAnswered: Joi.number().integer().min(0),
  chainName: Joi.string().required(),
});

// Export and use these schemas in your routes to validate the input
module.exports = {
  questionSchema,
};
