const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Standardizing Lab 01: Linux Fundamentals...');

  // Find the existing Lab 01 Chapter
  const chapter = await prisma.chapters.findFirst({
    where: { title: 'Linux Fundamentals Lab' }
  });

  if (!chapter) {
    console.error('❌ Lab 01 not found. Please run seed-labs.js first.');
    return;
  }

  // Clear existing progress/lessons/tasks for this chapter to avoid duplicates
  await prisma.user_progress.deleteMany({
    where: { task: { lesson: { chapter_id: chapter.id } } }
  });
  await prisma.lessons.deleteMany({ where: { chapter_id: chapter.id } });

  const lessonData = {
    title: 'Mastering the Core Shell',
    content_md: `# Linux Fundamentals: The Professional Foundation\n\nWelcome to your first professional-grade lab. Linux is the backbone of the internet and cybersecurity. In this lab, you will master the 20 most essential commands, solve 5 tactical exercises, and pass a theoretical examination to earn your certification.\n\n### Learning Objectives\n- Understand the Shell and Terminal environment.\n- Master file system navigation and manipulation.\n- Learn to use the internal help system (Manuals).\n- Demonstrate practical problem-solving in a real Linux environment.`,
    xp_reward: 100
  };

  const tasks = [
    // --- 20 COMMANDS (Practice) ---
    { description: 'Print current user (`whoami`)', expected_output: 'hacker', validation_type: 'contains', order_index: 0, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Identify current location (`pwd`)', expected_output: '/home/hacker', validation_type: 'contains', order_index: 1, xp_reward: 2, validation_rule: 'practice' },
    { description: 'List files in current directory (`ls`)', expected_output: '', validation_type: 'contains', order_index: 2, xp_reward: 2, validation_rule: 'practice' },
    { description: 'List all files including hidden (`ls -a`)', expected_output: '.', validation_type: 'contains', order_index: 3, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Create a directory named "sandbox" (`mkdir sandbox`)', expected_output: '', validation_type: 'custom', validation_rule: 'sandbox_exists', order_index: 4, xp_reward: 2 },
    { description: 'Change directory to "sandbox" (`cd sandbox`)', expected_output: '/home/hacker/sandbox', validation_type: 'contains', order_index: 5, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Create an empty file "test.txt" (`touch test.txt`)', expected_output: '', validation_type: 'custom', validation_rule: 'file_created', order_index: 6, xp_reward: 2 },
    { description: 'Copy "test.txt" to "backup.txt" (`cp test.txt backup.txt`)', expected_output: '', validation_type: 'contains', order_index: 7, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Rename "backup.txt" to "final.txt" (`mv backup.txt final.txt`)', expected_output: '', validation_type: 'contains', order_index: 8, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Display current date and time (`date`)', expected_output: '202', validation_type: 'contains', order_index: 9, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Show system uptime (`uptime`)', expected_output: 'up', validation_type: 'contains', order_index: 10, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Identify system information (`uname -a`)', expected_output: 'Linux', validation_type: 'contains', order_index: 11, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Print a message to the screen (`echo "Hello World"`)', expected_output: 'Hello World', validation_type: 'contains', order_index: 12, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Read a file content (`cat final.txt`)', expected_output: '', validation_type: 'contains', order_index: 13, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Clear the terminal screen (`clear`)', expected_output: '', validation_type: 'contains', order_index: 14, xp_reward: 2, validation_rule: 'practice' },
    { description: 'View manual of `ls` (`man ls` - simulated via output check)', expected_output: 'list directory contents', validation_type: 'contains', order_index: 15, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Check binary location of `ls` (`which ls`)', expected_output: '/bin/ls', validation_type: 'contains', order_index: 16, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Create a shortcut for `ls -la` named `ll` (`alias ll="ls -la"`)', expected_output: '', validation_type: 'contains', order_index: 17, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Check your current user ID (`id`)', expected_output: 'uid=', validation_type: 'contains', order_index: 18, xp_reward: 2, validation_rule: 'practice' },
    { description: 'Return to home directory (`cd ~`)', expected_output: '/home/hacker', validation_type: 'contains', order_index: 19, xp_reward: 2, validation_rule: 'practice' },

    // --- 5 EXERCISES (Tactical) ---
    { description: 'Exercise 1: Create a recursive directory structure "a/b/c" in one command.', expected_output: '', validation_type: 'contains', order_index: 20, xp_reward: 10, validation_rule: 'exercise' },
    { description: 'Exercise 2: Create "top_secret.txt" and move it inside "a/b/c".', expected_output: '', validation_type: 'contains', order_index: 21, xp_reward: 10, validation_rule: 'exercise' },
    { description: 'Exercise 3: Find out how many files are in the current directory and redirected to "count.txt".', expected_output: '', validation_type: 'contains', order_index: 22, xp_reward: 10, validation_rule: 'exercise' },
    { description: 'Exercise 4: Copy the file `/etc/hostname` to your current directory.', expected_output: '', validation_type: 'contains', order_index: 23, xp_reward: 10, validation_rule: 'exercise' },
    { description: 'Exercise 5: Delete the "sandbox" directory and its contents permanently.', expected_output: '', validation_type: 'contains', order_index: 24, xp_reward: 10, validation_rule: 'exercise' },

    // --- 5 MCQS (Theoretical) ---
    { 
      description: 'Which command is used to see your current directory path?', 
      validation_type: 'mcq', 
      validation_rule: JSON.stringify(['cd', 'ls', 'pwd', 'path']), 
      expected_output: '2', 
      order_index: 25, 
      xp_reward: 5 
    },
    { 
      description: 'How do you create a new directory in Linux?', 
      validation_type: 'mcq', 
      validation_rule: JSON.stringify(['mkdir', 'touch', 'newdir', 'create']), 
      expected_output: '0', 
      order_index: 26, 
      xp_reward: 5 
    },
    { 
      description: 'Which flag is used with `ls` to show hidden files?', 
      validation_type: 'mcq', 
      validation_rule: JSON.stringify(['-h', '-a', '-l', '-x']), 
      expected_output: '1', 
      order_index: 27, 
      xp_reward: 5 
    },
    { 
      description: 'What symbol represents the user\'s Home directory?', 
      validation_type: 'mcq', 
      validation_rule: JSON.stringify(['/', '.', '..', '~']), 
      expected_output: '3', 
      order_index: 28, 
      xp_reward: 5 
    },
    { 
      description: 'How do you access the manual page for the `mv` command?', 
      validation_type: 'mcq', 
      validation_rule: JSON.stringify(['help mv', 'man mv', 'info mv', 'mv --help']), 
      expected_output: '1', 
      order_index: 29, 
      xp_reward: 5 
    }
  ];

  await prisma.lessons.create({
    data: {
      chapter_id: chapter.id,
      title: lessonData.title,
      content_md: lessonData.content_md,
      order_index: 0,
      is_published: true,
      xp_reward: 50,
      tasks: {
        create: tasks.map(t => ({
          description: t.description,
          validation_type: t.validation_type,
          validation_rule: t.validation_rule,
          expected_output: t.expected_output,
          order_index: t.order_index,
          xp_reward: t.xp_reward
        }))
      }
    }
  });

  console.log('✨ Lab 01 Standardized Successfully (20-5-5 format).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
