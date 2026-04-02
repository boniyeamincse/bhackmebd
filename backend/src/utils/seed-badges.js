const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BADGES = [
  { name: 'First Step', description: 'Complete your first task.', icon_url: 'icon-badge-first-step', criteria_type: 'tasks_completed', criteria_value: 1 },
  { name: 'Quick Learner', description: 'Complete 10 tasks.', icon_url: 'icon-badge-quick-learner', criteria_type: 'tasks_completed', criteria_value: 10 },
  { name: 'Terminal Pro', description: 'Complete 100 tasks.', icon_url: 'icon-badge-terminal-pro', criteria_type: 'tasks_completed', criteria_value: 100 },
  { name: 'Hacker', description: 'Reach hacker level.', icon_url: 'icon-badge-hacker', criteria_type: 'level', criteria_value: 4 },
  { name: 'Persistence I', description: 'Maintain a 3-day streak.', icon_url: 'icon-badge-persistence-1', criteria_type: 'streak_days', criteria_value: 3 },
  { name: 'Persistence II', description: 'Maintain a 7-day streak.', icon_url: 'icon-badge-persistence-2', criteria_type: 'streak_days', criteria_value: 7 },
  { name: 'Persistence III', description: 'Maintain a 30-day streak.', icon_url: 'icon-badge-persistence-3', criteria_type: 'streak_days', criteria_value: 30 },
  { name: 'Chapter Starter', description: 'Complete your first chapter.', icon_url: 'icon-badge-chapter-starter', criteria_type: 'chapters_completed', criteria_value: 1 },
  { name: 'Chapter Explorer', description: 'Complete 3 chapters.', icon_url: 'icon-badge-chapter-explorer', criteria_type: 'chapters_completed', criteria_value: 3 },
  { name: 'Chapter Master', description: 'Complete 5 chapters.', icon_url: 'icon-badge-chapter-master', criteria_type: 'chapters_completed', criteria_value: 5 },
  { name: 'Login Rookie', description: 'Log in for 5 total days.', icon_url: 'icon-badge-login-rookie', criteria_type: 'login_days', criteria_value: 5 },
  { name: 'Login Veteran', description: 'Log in for 20 total days.', icon_url: 'icon-badge-login-veteran', criteria_type: 'login_days', criteria_value: 20 },
  { name: 'XP Grinder I', description: 'Earn 500 XP.', icon_url: 'icon-badge-xp-grinder-1', criteria_type: 'total_xp', criteria_value: 500 },
  { name: 'XP Grinder II', description: 'Earn 2000 XP.', icon_url: 'icon-badge-xp-grinder-2', criteria_type: 'total_xp', criteria_value: 2000 },
  { name: 'XP Grinder III', description: 'Earn 5000 XP.', icon_url: 'icon-badge-xp-grinder-3', criteria_type: 'total_xp', criteria_value: 5000 },
];

async function main() {
  for (const badge of BADGES) {
    await prisma.badges.upsert({
      where: { name: badge.name },
      update: {
        description: badge.description,
        icon_url: badge.icon_url,
        criteria_type: badge.criteria_type,
        criteria_value: badge.criteria_value,
      },
      create: badge,
    });
  }

  console.log(`Seeded ${BADGES.length} badges`);
}

main()
  .catch((err) => {
    console.error('Failed to seed badges', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
