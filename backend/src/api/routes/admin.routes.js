const express = require('express');
const router = express.Router();
const {
  createChapter, updateChapter, deleteChapter,
  createLesson, updateLesson,
  listUsers, systemStats,
} = require('../controllers/admin.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { chapterSchema, lessonSchema } = require('../schemas/admin.schema');

router.use(authenticate, requireAdmin);

router.post('/chapters', validate(chapterSchema), createChapter);
router.put('/chapters/:id', validate(chapterSchema), updateChapter);
router.delete('/chapters/:id', deleteChapter);
router.post('/lessons', validate(lessonSchema), createLesson);
router.put('/lessons/:id', validate(lessonSchema), updateLesson);
router.get('/users', listUsers);
router.get('/system', systemStats);

module.exports = router;
