const Joi = require('joi');

const chapterSchema = Joi.object({
  title: Joi.string().max(255).required(),
  title_bn: Joi.string().max(255).allow(null, ''),
  description: Joi.string().allow(null, ''),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'hacker').required(),
  order_index: Joi.number().integer().required(),
  is_published: Joi.boolean().default(false),
  thumbnail_url: Joi.string().uri().allow(null, ''),
  xp_reward: Joi.number().integer().min(0).default(100),
});

const lessonSchema = Joi.object({
  chapter_id: Joi.string().uuid().required(),
  title: Joi.string().max(255).required(),
  title_bn: Joi.string().max(255).allow(null, ''),
  content_md: Joi.string().required(),
  order_index: Joi.number().integer().required(),
  xp_reward: Joi.number().integer().min(0).default(50),
  is_published: Joi.boolean().default(false),
});

module.exports = { chapterSchema, lessonSchema };
