const prisma = require('../config/database');

const XP_MILESTONES = [
  { xp: 1000, badge: '1000 XP' },
  { xp: 3500, badge: 'Hacker Level' },
];

const checkAndAward = async (userId, totalXp) => {
  const user = await prisma.users.findUnique({ where: { id: userId }, select: { badges: true } });
  const currentBadges = user.badges || [];
  const newBadges = [];

  for (const { xp, badge } of XP_MILESTONES) {
    if (totalXp >= xp && !currentBadges.includes(badge)) {
      newBadges.push(badge);
    }
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
