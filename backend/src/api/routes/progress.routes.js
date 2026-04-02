const express = require('express');
const router = express.Router();
const { getProgress, validate, getStats, getLeaderboard } = require('../controllers/progress.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, getProgress);
router.post('/validate', authenticate, validate);
router.get('/stats', authenticate, getStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
