const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('hacker123', 10);
  await prisma.users.upsert({
    where: { email: 'hacker@bhackme.co' },
    update: { password: hashedPassword },
    create: {
      username: 'hacker',
      email: 'hacker@bhackme.co',
      password: hashedPassword,
      role: 'user'
    }
  });
  console.log('✅ User hacker@bhackme.co updated with password hacker123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
