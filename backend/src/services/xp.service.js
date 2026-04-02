const prisma = require('../config/database');
const BadgeService = require('./badge.service');

const LEVELS = [
  { min: 0, max: 499, label: 'beginner' },
  { min: 500, max: 1499, label: 'intermediate' },
  { min: 1500, max: 3499, label: 'advanced' },
  { min: 3500, max: Infinity, label: 'hacker' },
];

const award = async (userId, xp, taskId) => {
  const user = await prisma.users.update({
    where: { id: userId },
    data: { total_xp: { increment: xp } },
    select: { total_xp: true, level: true },
  });

  await prisma.user_progress.upsert({
    where: { user_id_task_id: { user_id: userId, task_id: taskId } },
    update: { status: 'completed', xp_earned: xp, completed_at: new Date() },
    create: { user_id: userId, task_id: taskId, status: 'completed', xp_earned: xp, completed_at: new Date() },
  });

  const newLevel = LEVELS.find((l) => user.total_xp >= l.min && user.total_xp <= l.max)?.label;
  if (newLevel && newLevel !== user.level) {
    await prisma.users.update({ where: { id: userId }, data: { level: newLevel } });
  }

  await BadgeService.checkAndAward(userId, user.total_xp);
};

module.exports = { award };
