const Joi = require('joi');

const validateTaskSchema = Joi.object({
  taskId: Joi.string().required(),
  output: Joi.string().allow('', null).default('').optional(),
});

module.exports = { validateTaskSchema };
