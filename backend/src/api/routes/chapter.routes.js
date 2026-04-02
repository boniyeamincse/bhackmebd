const express = require('express');
const router = express.Router();
const { listChapters, getChapter, getChapterLessons } = require('../controllers/chapter.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, listChapters);
router.get('/:id', authenticate, getChapter);
router.get('/:id/lessons', authenticate, getChapterLessons);

module.exports = router;
