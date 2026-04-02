const express = require('express');
const router = express.Router();
const { startTerminal, stopTerminal, terminalStatus } = require('../controllers/terminal.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/start', authenticate, startTerminal);
router.delete('/stop', authenticate, stopTerminal);
router.get('/status', authenticate, terminalStatus);

module.exports = router;
