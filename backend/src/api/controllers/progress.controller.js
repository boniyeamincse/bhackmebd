const prisma = require('../../config/database');
const ValidatorService = require('../../services/validator.service');
const XpService = require('../../services/xp.service');

const getProgress = async (req, res, next) => {
  try {
    const progress = await prisma.user_progress.findMany({
      where: { user_id: req.user.id },
    });
    res.json({ progress });
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
      await XpService.award(req.user.id, task.xp_reward, taskId);
      return res.json({ success: true, xp: task.xp_reward, message: `Correct! +${task.xp_reward} XP` });
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
    res.json({ stats: user });
  } catch (err) {
    next(err);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { total_xp: 'desc' },
      take: 50,
      select: { username: true, total_xp: true, level: true, avatar_url: true },
    });
    res.json({ leaderboard: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, validate, getStats, getLeaderboard };
