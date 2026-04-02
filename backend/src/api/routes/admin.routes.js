const express = require('express');
const router = express.Router();
const {
  getDashboard,
  listChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  toggleChapterPublish,
  reorderChapters,
  listLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  listTasks,
  createTask,
  testTaskValidation,
  listUsers,
  getUserProgress,
  setUserActive,
  forceKillUserSession,
  listActiveContainers,
  systemStats,
} = require('../controllers/admin.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  chapterSchema,
  lessonSchema,
  chapterPublishSchema,
  chapterReorderSchema,
  taskSchema,
  taskValidationTestSchema,
  userStatusSchema,
} = require('../schemas/admin.schema');

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboard);

router.get('/chapters', listChapters);
router.post('/chapters', validate(chapterSchema), createChapter);
router.put('/chapters/:id', validate(chapterSchema), updateChapter);
router.patch('/chapters/:id/publish', validate(chapterPublishSchema), toggleChapterPublish);
router.post('/chapters/reorder', validate(chapterReorderSchema), reorderChapters);
router.delete('/chapters/:id', deleteChapter);

router.get('/lessons', listLessons);
router.post('/lessons', validate(lessonSchema), createLesson);
router.put('/lessons/:id', validate(lessonSchema), updateLesson);
router.delete('/lessons/:id', deleteLesson);

router.get('/tasks', listTasks);
router.post('/tasks', validate(taskSchema), createTask);
router.post('/tasks/test-validation', validate(taskValidationTestSchema), testTaskValidation);

router.get('/users', listUsers);
router.get('/users/:id/progress', getUserProgress);
router.patch('/users/:id/status', validate(userStatusSchema), setUserActive);
router.delete('/users/:id/session', forceKillUserSession);

router.get('/containers', listActiveContainers);
router.get('/system', systemStats);

module.exports = router;
