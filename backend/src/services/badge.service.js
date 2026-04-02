const prisma = require('../config/database');

const XP_MILESTONES = [
  { xp: 1000, badge: '1000 XP' },
  { xp: 3500, badge: 'Hacker Level' },
];

const checkAndAward = async (userId, totalXp) => {
  const user = await prisma.users.findUnique({ where: { id: userId }, select: { badges: true, level: true } });
  const currentBadges = user.badges || [];
  const newBadges = [];

  const completedTasks = await prisma.user_progress.count({
    where: { user_id: userId, status: 'completed' },
  });

  if (completedTasks >= 1 && !currentBadges.includes('First Step')) {
    newBadges.push('First Step');
  }
  if (completedTasks >= 100 && !currentBadges.includes('Terminal Pro')) {
    newBadges.push('Terminal Pro');
  }

  for (const { xp, badge } of XP_MILESTONES) {
    if (totalXp >= xp && !currentBadges.includes(badge)) {
      newBadges.push(badge);
    }
  }

  if (user.level === 'hacker' && !currentBadges.includes('Hacker Level')) {
    newBadges.push('Hacker Level');
  }

  if (newBadges.length > 0) {
    await prisma.users.update({
      where: { id: userId },
      data: { badges: { set: [...currentBadges, ...newBadges] } },
    });
  }

  return newBadges;
};

module.exports = { checkAndAward };
