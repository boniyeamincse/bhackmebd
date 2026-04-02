const prisma = require('../../config/database');
const ValidatorService = require('../../services/validator.service');
const XpService = require('../../services/xp.service');
const StreakService = require('../../services/streak.service');

const getProgress = async (req, res, next) => {
  try {
    const progress = await prisma.user_progress.findMany({
      where: { user_id: req.user.id },
      include: {
        task: {
          select: {
            id: true,
            lesson_id: true,
            order_index: true,
          },
        },
        lesson: {
          select: {
            id: true,
            chapter_id: true,
            order_index: true,
          },
        },
      },
    });

    const map = progress.map((p) => ({
      chapterId: p.chapter_id || p.lesson?.chapter_id || null,
      lessonId: p.lesson_id || p.task?.lesson_id || null,
      taskId: p.task_id,
      status: p.status,
      attempts: p.attempts,
      xpEarned: p.xp_earned,
      completedAt: p.completed_at,
    }));

    res.json({ progress: map });
  } catch (err) {
    next(err);
  }
};

const validate = async (req, res, next) => {
  try {
    const { taskId, output } = req.body;
    const task = await prisma.tasks.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const passed = ValidatorService.check(task, output);

    if (passed) {
      const result = await XpService.award(req.user.id, task.xp_reward, taskId);
      return res.json({
        success: true,
        xp: task.xp_reward,
        totalXp: result.totalXp,
        level: result.level,
        levelUp: result.levelUp,
        badges: result.badges,
        message: `Correct! +${task.xp_reward} XP`,
      });
    }

    const record = await prisma.user_progress.upsert({
      where: { user_id_task_id: { user_id: req.user.id, task_id: taskId } },
      update: { attempts: { increment: 1 } },
      create: { user_id: req.user.id, task_id: taskId, attempts: 1 },
    });

    res.json({ success: false, attempts: record.attempts, hint: task.hint });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { total_xp: true, level: true, badges: true },
    });
    const streak = await StreakService.getStreak(req.user.id);
    res.json({
      stats: {
        total_xp: user?.total_xp || 0,
        level: user?.level || 'beginner',
        badges: user?.badges || [],
        badgeCount: (user?.badges || []).length,
        streak,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        orderBy: { total_xp: 'desc' },
        skip,
        take: limit,
        select: { username: true, total_xp: true, level: true, avatar_url: true },
      }),
      prisma.users.count(),
    ]);

    res.json({
      leaderboard: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, validate, getStats, getLeaderboard };
