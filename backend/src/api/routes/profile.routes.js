const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  getMe,
  updateProfile,
  updateName,
  updateAvatar,
  removeAvatar,
  updatePassword,
  updateEmail,
  updateUsername,
} = require('../controllers/profile.controller');
const {
  updateProfileSchema,
  updateNameSchema,
  updateAvatarSchema,
  updatePasswordSchema,
  updateEmailSchema,
  updateUsernameSchema,
} = require('../schemas/profile.schema');

router.get('/', authenticate, getMe);
router.put('/', authenticate, validate(updateProfileSchema), updateProfile);
router.patch('/', authenticate, validate(updateProfileSchema), updateProfile);
router.patch('/name', authenticate, validate(updateNameSchema), updateName);
router.patch('/avatar', authenticate, validate(updateAvatarSchema), updateAvatar);
router.delete('/avatar', authenticate, removeAvatar);
router.patch('/password', authenticate, validate(updatePasswordSchema), updatePassword);
router.patch('/email', authenticate, validate(updateEmailSchema), updateEmail);
router.patch('/username', authenticate, validate(updateUsernameSchema), updateUsername);

module.exports = router;
