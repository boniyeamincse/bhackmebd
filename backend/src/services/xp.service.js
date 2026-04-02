const prisma = require('../config/database');
const BadgeService = require('./badge.service');

const LEVELS = [
  { min: 0, max: 499, label: 'beginner' },
  { min: 500, max: 1499, label: 'intermediate' },
  { min: 1500, max: 3499, label: 'advanced' },
  { min: 3500, max: Infinity, label: 'hacker' },
];

const award = async (userId, xp, taskId) => {
  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: {
      lesson_id: true,
      lesson: {
        select: {
          chapter_id: true,
        },
      },
    },
  });

  const user = await prisma.users.update({
    where: { id: userId },
    data: { total_xp: { increment: xp } },
    select: { total_xp: true, level: true },
  });

  await prisma.user_progress.upsert({
    where: { user_id_task_id: { user_id: userId, task_id: taskId } },
    update: {
      status: 'completed',
      xp_earned: xp,
      completed_at: new Date(),
      lesson_id: task?.lesson_id || null,
      chapter_id: task?.lesson?.chapter_id || null,
    },
    create: {
      user_id: userId,
      task_id: taskId,
      status: 'completed',
      xp_earned: xp,
      completed_at: new Date(),
      lesson_id: task?.lesson_id || null,
      chapter_id: task?.lesson?.chapter_id || null,
    },
  });

  const newLevel = LEVELS.find((l) => user.total_xp >= l.min && user.total_xp <= l.max)?.label;
  let level = user.level;
  let levelUp = false;
  if (newLevel && newLevel !== user.level) {
    await prisma.users.update({ where: { id: userId }, data: { level: newLevel } });
    level = newLevel;
    levelUp = true;
  }

  const badges = await BadgeService.checkAndAward(userId, user.total_xp);

  return {
    totalXp: user.total_xp,
    level,
    levelUp,
    badges,
  };
};

module.exports = { award };
