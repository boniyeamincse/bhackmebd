const express = require('express');
const router = express.Router();
const {
	register,
	login,
	logout,
	me,
	refresh,
	forgotPassword,
	resetPassword,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
	registerSchema,
	loginSchema,
	refreshSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
} = require('../schemas/auth.schema');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.post('/refresh', validate(refreshSchema), refresh);

module.exports = router;
