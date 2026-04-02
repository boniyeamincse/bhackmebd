const Joi = require('joi');

const updateProfileSchema = Joi.object({
  full_name: Joi.string().max(150).allow('').required(),
});

const updateNameSchema = Joi.object({
  full_name: Joi.string().max(150).allow('').required(),
});

const updateAvatarSchema = Joi.object({
  avatar: Joi.string().pattern(/^data:image\/[A-Za-z-+/]+;base64,.+$/).required(),
});

const updatePasswordSchema = Joi.object({
  current_password: Joi.string().min(8).max(128).required(),
  new_password: Joi.string().min(8).max(128).required(),
});

const updateEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const updateUsernameSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
});

module.exports = {
  updateProfileSchema,
  updateNameSchema,
  updateAvatarSchema,
  updatePasswordSchema,
  updateEmailSchema,
  updateUsernameSchema,
};
