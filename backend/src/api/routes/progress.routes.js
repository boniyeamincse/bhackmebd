const express = require('express');
const router = express.Router();
const { getProgress, validate, getStats, getLeaderboard } = require('../controllers/progress.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate: validateBody } = require('../middleware/validate.middleware');
const { validateTaskSchema } = require('../schemas/progress.schema');

router.get('/', authenticate, getProgress);
router.post('/validate', authenticate, validateBody(validateTaskSchema), validate);
router.get('/stats', authenticate, getStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
