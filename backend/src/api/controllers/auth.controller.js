const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const redis = require('../../config/redis');
const { AppError } = require('../../utils/errors');
const StreakService = require('../../services/streak.service');

const signToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

const hashResetToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await prisma.users.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) throw new AppError('Username or email already taken', 409);

    const password_hash = await bcrypt.hash(password, 12);
    const user = await prisma.users.create({
      data: { username, email, password_hash },
      select: { id: true, username: true, email: true, role: true },
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = signToken({ id: user.id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '15m');
    const refreshToken = signToken({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');

    await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, refreshToken);
    const streak = await StreakService.markDailyLogin(user.id);

    res.json({
      accessToken,
      refreshToken,
      streak,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        level: user.level,
        total_xp: user.total_xp
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await redis.del(`refresh:${req.user.id}`);
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, email: true, full_name: true, avatar_url: true, role: true, level: true, total_xp: true, badges: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const stored = await redis.get(`refresh:${payload.id}`);
    if (stored !== refreshToken) throw new AppError('Invalid refresh token', 401);

    const user = await prisma.users.findUnique({ where: { id: payload.id }, select: { id: true, role: true } });
    const accessToken = signToken({ id: user.id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '15m');

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.users.findUnique({
      where: { email },
      select: { id: true },
    });

    // Avoid user enumeration by always returning success message.
    if (!user) {
      return res.json({
        message: 'If an account exists with that email, a reset link has been generated.',
      });
    }

    const ttlSeconds = Number(process.env.FORGOT_PASSWORD_TTL_SECONDS || 900);
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(resetToken);
    const redisKey = `pwdreset:${tokenHash}`;

    await redis.setex(redisKey, ttlSeconds, user.id);

    const response = {
      message: 'If an account exists with that email, a reset link has been generated.',
    };

    if (process.env.NODE_ENV !== 'production') {
      response.resetToken = resetToken;
      response.resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      response.expiresInSeconds = ttlSeconds;
    }

    return res.json(response);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const tokenHash = hashResetToken(token);
    const redisKey = `pwdreset:${tokenHash}`;
    const userId = await redis.get(redisKey);

    if (!userId) throw new AppError('Invalid or expired reset token', 400);

    const password_hash = await bcrypt.hash(password, 12);

    await prisma.users.update({
      where: { id: userId },
      data: { password_hash },
    });

    await Promise.all([
      redis.del(redisKey),
      redis.del(`refresh:${userId}`),
    ]);

    res.json({ message: 'Password reset successful. Please login again.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, me, refresh, forgotPassword, resetPassword };
