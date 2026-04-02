const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { errorMiddleware } = require('./api/middleware/error.middleware');
const { rateLimitMiddleware } = require('./api/middleware/rateLimit.middleware');

const authRoutes = require('./api/routes/auth.routes');
const chapterRoutes = require('./api/routes/chapter.routes');
const lessonRoutes = require('./api/routes/lesson.routes');
const terminalRoutes = require('./api/routes/terminal.routes');
const progressRoutes = require('./api/routes/progress.routes');
const leaderboardRoutes = require('./api/routes/leaderboard.routes');
const adminRoutes = require('./api/routes/admin.routes');
const profileRoutes = require('./api/routes/profile.routes');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false })); // Allow cross-origin images
app.use(cors({ origin: process.env.APP_URL, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(rateLimitMiddleware);
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/terminal', terminalRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);

app.use(errorMiddleware);

module.exports = app;
