const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const prisma = require('../../config/database');
const redis = require('../../config/redis');
const { AppError } = require('../../utils/errors');

const userSelect = {
  id: true,
  username: true,
  email: true,
  full_name: true,
  avatar_url: true,
  role: true,
  level: true,
  total_xp: true,
  badges: true,
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: userSelect,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { full_name } = req.body;
    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { full_name },
      select: userSelect,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateName = async (req, res, next) => {
  try {
    const { full_name } = req.body;
    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { full_name },
      select: userSelect,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (!avatar) throw new AppError('Avatar data required', 400);

    const matches = avatar.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) throw new AppError('Invalid image format', 400);

    const extension = matches[1];
    const data = Buffer.from(matches[2], 'base64');
    const filename = `avatar-${req.user.id}-${Date.now()}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    const filePath = path.join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, data);

    const avatarUrl = `/uploads/avatars/${filename}`;

    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { avatar_url: avatarUrl },
      select: userSelect,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const removeAvatar = async (req, res, next) => {
  try {
    const existing = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { avatar_url: true },
    });

    if (existing?.avatar_url && existing.avatar_url.startsWith('/uploads/avatars/')) {
      const localPath = path.join(process.cwd(), existing.avatar_url.replace(/^\//, ''));
      await fs.unlink(localPath).catch(() => null);
    }

    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { avatar_url: null },
      select: userSelect,
    });

    res.json({ user, message: 'Avatar removed' });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { id: true, password_hash: true },
    });

    if (!user) throw new AppError('User not found', 404);

    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) throw new AppError('Current password is incorrect', 400);

    const password_hash = await bcrypt.hash(new_password, 12);

    await Promise.all([
      prisma.users.update({
        where: { id: req.user.id },
        data: { password_hash },
      }),
      redis.del(`refresh:${req.user.id}`),
    ]);

    res.json({ message: 'Password updated successfully. Please login again.' });
  } catch (err) {
    next(err);
  }
};

const updateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existing = await prisma.users.findFirst({
      where: {
        email,
        id: { not: req.user.id },
      },
      select: { id: true },
    });

    if (existing) throw new AppError('Email already in use', 409);

    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { email },
      select: userSelect,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    const existing = await prisma.users.findFirst({
      where: {
        username,
        id: { not: req.user.id },
      },
      select: { id: true },
    });

    if (existing) throw new AppError('Username already in use', 409);

    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { username },
      select: userSelect,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateProfile,
  updateName,
  updateAvatar,
  removeAvatar,
  updatePassword,
  updateEmail,
  updateUsername,
};
