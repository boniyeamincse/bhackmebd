const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/progress.controller');

router.get('/', getLeaderboard);

module.exports = router;
