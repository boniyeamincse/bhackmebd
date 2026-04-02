const Joi = require('joi');

const validateTaskSchema = Joi.object({
  taskId: Joi.string().uuid().required(),
  output: Joi.string().allow('').required(),
});

module.exports = { validateTaskSchema };
