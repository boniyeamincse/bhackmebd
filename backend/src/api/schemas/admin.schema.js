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

const chapterPublishSchema = Joi.object({
  is_published: Joi.boolean().required(),
});

const chapterReorderSchema = Joi.object({
  chapterIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

const taskSchema = Joi.object({
  lesson_id: Joi.string().uuid().required(),
  description: Joi.string().required(),
  expected_output: Joi.string().allow(null, ''),
  validation_type: Joi.string().valid('exact', 'contains', 'regex', 'custom').required(),
  validation_rule: Joi.string().allow(null, ''),
  hint: Joi.string().allow(null, ''),
  xp_reward: Joi.number().integer().min(0).default(25),
  order_index: Joi.number().integer().required(),
});

const taskValidationTestSchema = Joi.object({
  validation_type: Joi.string().valid('exact', 'contains', 'regex', 'custom').required(),
  expected_output: Joi.string().allow(null, ''),
  validation_rule: Joi.string().allow(null, ''),
  output: Joi.string().allow('', null),
});

const userStatusSchema = Joi.object({
  is_active: Joi.boolean().required(),
});

module.exports = {
  chapterSchema,
  lessonSchema,
  chapterPublishSchema,
  chapterReorderSchema,
  taskSchema,
  taskValidationTestSchema,
  userStatusSchema,
};
