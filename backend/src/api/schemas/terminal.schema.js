const Joi = require('joi');

const terminalConnectSchema = Joi.object({
  lessonId: Joi.string().uuid().required(),
});

module.exports = { terminalConnectSchema };
