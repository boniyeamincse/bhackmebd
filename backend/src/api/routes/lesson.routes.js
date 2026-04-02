const express = require('express');
const router = express.Router();
const { getLesson } = require('../controllers/chapter.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/:id', authenticate, getLesson);

module.exports = router;
