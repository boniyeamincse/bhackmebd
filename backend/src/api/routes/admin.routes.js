const express = require('express');
const router = express.Router();
const {
  createChapter, updateChapter, deleteChapter,
  createLesson, updateLesson,
  listUsers, systemStats,
} = require('../controllers/admin.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.use(authenticate, requireAdmin);

router.post('/chapters', createChapter);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);
router.post('/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.get('/users', listUsers);
router.get('/system', systemStats);

module.exports = router;
