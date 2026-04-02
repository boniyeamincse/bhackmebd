const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Linux Curriculum...');

  const curriculum = [
    {
      title: 'Linux Fundamentals Lab',
      difficulty: 'beginner',
      description: 'Master the absolute basics of the Linux terminal.',
      xp_reward: 100,
      lessons: [
        {
          title: 'Your First Commands',
          content_md: '# Welcome to Linux\n\nIn this lesson, you will learn how to navigate the file system using `pwd`, `ls`, and `cd`.',
          tasks: [
            { description: 'Print your current working directory.', expected_output: '/home/hacker', validation_type: 'contains', xp_reward: 20 }
          ]
        }
      ]
    },
    {
      title: 'Command Line Basics Lab',
      difficulty: 'beginner',
      description: 'Go beyond the basics and learn how to manipulate text and output.',
      xp_reward: 100,
      lessons: [{ title: 'Text Output', content_md: 'Learn `echo` and `cat`.', tasks: [] }]
    },
    {
      title: 'File System Exploration Lab',
      difficulty: 'beginner',
      description: 'Learn how to create, move, and organize files.',
      xp_reward: 120,
      lessons: [{ title: 'File Operations', content_md: 'Using `touch`, `mkdir`, and `cp`.', tasks: [] }]
    },
    {
      title: 'Linux Permissions & Ownership Lab',
      difficulty: 'beginner',
      description: 'Understand the security model of Linux files.',
      xp_reward: 150,
      lessons: [{ title: 'chmod & chown', content_md: 'Mastering file permissions.', tasks: [] }]
    },
    {
      title: 'Basic Package Management Lab',
      difficulty: 'beginner',
      description: 'Learn how to install and update software on Debian-based systems.',
      xp_reward: 150,
      lessons: [{ title: 'Apt Basics', content_md: 'Installing packages with `apt`.', tasks: [] }]
    },
    {
      title: 'Linux Intermediate Operations Lab',
      difficulty: 'intermediate',
      description: 'Powerful tools for searching and filtering data.',
      xp_reward: 200,
      lessons: [{ title: 'Grep & Find', content_md: 'Searching for files and patterns.', tasks: [] }]
    },
    {
      title: 'Process & Service Management Lab',
      difficulty: 'intermediate',
      description: 'Manage what runs on your system.',
      xp_reward: 250,
      lessons: [{ title: 'Systemd', content_md: 'Working with `systemctl`.', tasks: [] }]
    },
    {
      title: 'Disk & Storage Management Lab',
      difficulty: 'intermediate',
      description: 'Managing partitions, filesystems, and mounts.',
      xp_reward: 250,
      lessons: [{ title: 'Disk Usage', content_md: 'Using `df` and `du`.', tasks: [] }]
    },
    {
      title: 'Shell Scripting Basics Lab',
      difficulty: 'intermediate',
      description: 'Automate repetitive tasks with Bash.',
      xp_reward: 300,
      lessons: [{ title: 'Variables & Loops', content_md: 'Introduction to Bash scripting.', tasks: [] }]
    },
    {
      title: 'User & Group Management Lab',
      difficulty: 'intermediate',
      description: 'Administering multiple users and security groups.',
      xp_reward: 250,
      lessons: [{ title: 'User Management', content_md: 'Adding and modifying users.', tasks: [] }]
    },
    {
      title: 'Advanced Linux Administration Lab',
      difficulty: 'advanced',
      description: 'Deep dive into kernel management and advanced admin tasks.',
      xp_reward: 500,
      lessons: [{ title: 'Kernel Modules', content_md: 'Working with `lsmod` and `modprobe`.', tasks: [] }]
    },
    {
      title: 'System Monitoring & Performance Lab',
      difficulty: 'advanced',
      description: 'Identifying and fixing performance bottlenecks.',
      xp_reward: 400,
      lessons: [{ title: 'Monitoring Tools', content_md: 'Using `iostat` and `top`.', tasks: [] }]
    },
    {
      title: 'Security Hardening Lab',
      difficulty: 'advanced',
      description: 'Securing your Linux server against attackers.',
      xp_reward: 600,
      lessons: [{ title: 'SSH Hardening', content_md: 'Configuring secure SSH access.', tasks: [] }]
    },
    {
      title: 'Linux Troubleshooting Lab',
      difficulty: 'advanced',
      description: 'Master the art of debugging system failures.',
      xp_reward: 500,
      lessons: [{ title: 'Log Analysis', content_md: 'Using `journalctl` effectively.', tasks: [] }]
    },
    {
      title: 'Linux Networking Lab',
      difficulty: 'hacker',
      description: 'Advanced networking, routing, and firewall configuration.',
      xp_reward: 1000,
      lessons: [
        {
          title: 'Network Basics',
          content_md: '# Networking in Linux\n\nTest your knowledge with an MCQ.',
          tasks: [
            {
              description: 'Which command is used to display the IP address of all interfaces?',
              validation_type: 'mcq',
              validation_rule: JSON.stringify(['ip addr', 'ls', 'pwd', 'whoami']),
              expected_output: '0',
              xp_reward: 50
            }
          ]
        }
      ]
    }
  ];

  for (const track of curriculum) {
    const chapter = await prisma.chapters.create({
      data: {
        title: track.title,
        description: track.description,
        level: track.difficulty,
        xp_reward: track.xp_reward,
        order_index: curriculum.indexOf(track),
        is_published: true,
        lessons: {
          create: track.lessons.map((lesson, lessonIndex) => ({
            title: lesson.title,
            content_md: lesson.content_md,
            order_index: lessonIndex,
            is_published: true,
            xp_reward: 50,
            tasks: {
              create: lesson.tasks.map((task, taskIndex) => ({
                description: task.description,
                validation_type: task.validation_type,
                validation_rule: task.validation_rule,
                expected_output: task.expected_output,
                order_index: taskIndex,
                xp_reward: task.xp_reward
              }))
            }
          }))
        }
      }
    });
    console.log(`✅ Created ${track.title} (${track.difficulty})`);
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
