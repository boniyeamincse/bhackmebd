const prisma = require('../../config/database');
const docker = require('../../config/docker');
const DockerService = require('../../services/docker.service');
const ValidatorService = require('../../services/validator.service');

const containerNamePrefix = 'bhackme-user-';

const getDashboard = async (req, res, next) => {
  try {
    const [users, activeContainers, xpAgg] = await Promise.all([
      prisma.users.findMany({ select: { created_at: true } }),
      docker.listContainers({ filters: { name: [containerNamePrefix] } }),
      prisma.users.aggregate({ _sum: { total_xp: true } }),
    ]);

    const now = new Date();
    const dayKeys = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    const userChartMap = dayKeys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    for (const user of users) {
      const key = user.created_at.toISOString().slice(0, 10);
      if (userChartMap[key] !== undefined) userChartMap[key] += 1;
    }

    res.json({
      stats: {
        totalUsers: users.length,
        activeContainers: activeContainers.length,
        xpDistributed: xpAgg._sum.total_xp || 0,
      },
      charts: {
        userRegistrations7d: dayKeys.map((key) => ({ day: key, count: userChartMap[key] })),
      },
    });
  } catch (err) {
    next(err);
  }
};

const listChapters = async (req, res, next) => {
  try {
    const chapters = await prisma.chapters.findMany({
      orderBy: { order_index: 'asc' },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });
    res.json({ chapters });
  } catch (err) {
    next(err);
  }
};

const createChapter = async (req, res, next) => {
  try {
    const chapter = await prisma.chapters.create({ data: req.body });
    res.status(201).json({ chapter });
  } catch (err) {
    next(err);
  }
};

const updateChapter = async (req, res, next) => {
  try {
    const chapter = await prisma.chapters.update({ where: { id: req.params.id }, data: req.body });
    res.json({ chapter });
  } catch (err) {
    next(err);
  }
};

const deleteChapter = async (req, res, next) => {
  try {
    await prisma.chapters.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const toggleChapterPublish = async (req, res, next) => {
  try {
    const chapter = await prisma.chapters.update({
      where: { id: req.params.id },
      data: { is_published: req.body.is_published },
    });
    res.json({ chapter });
  } catch (err) {
    next(err);
  }
};

const reorderChapters = async (req, res, next) => {
  try {
    const { chapterIds } = req.body;
    await prisma.$transaction(
      chapterIds.map((id, idx) => prisma.chapters.update({ where: { id }, data: { order_index: idx + 1 } }))
    );
    res.json({ message: 'Chapter order updated' });
  } catch (err) {
    next(err);
  }
};

const listLessons = async (req, res, next) => {
  try {
    const where = req.query.chapterId ? { chapter_id: req.query.chapterId } : {};
    const lessons = await prisma.lessons.findMany({ where, orderBy: { order_index: 'asc' } });
    res.json({ lessons });
  } catch (err) {
    next(err);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const lesson = await prisma.lessons.create({ data: req.body });
    res.status(201).json({ lesson });
  } catch (err) {
    next(err);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lesson = await prisma.lessons.update({ where: { id: req.params.id }, data: req.body });
    res.json({ lesson });
  } catch (err) {
    next(err);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    await prisma.lessons.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const listTasks = async (req, res, next) => {
  try {
    const where = req.query.lessonId ? { lesson_id: req.query.lessonId } : {};
    const tasks = await prisma.tasks.findMany({ where, orderBy: { order_index: 'asc' } });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await prisma.tasks.create({ data: req.body });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

const testTaskValidation = async (req, res, next) => {
  try {
    const task = {
      validation_type: req.body.validation_type,
      expected_output: req.body.expected_output,
      validation_rule: req.body.validation_rule,
    };
    const passed = ValidatorService.check(task, req.body.output || '');
    res.json({ passed });
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        level: true,
        total_xp: true,
        is_active: true,
        created_at: true,
        _count: {
          select: { progress: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

const getUserProgress = async (req, res, next) => {
  try {
    const progress = await prisma.user_progress.findMany({
      where: { user_id: req.params.id },
      include: {
        lesson: { select: { id: true, title: true, chapter_id: true } },
        task: { select: { id: true, description: true } },
      },
      orderBy: { completed_at: 'desc' },
    });
    res.json({ progress });
  } catch (err) {
    next(err);
  }
};

const setUserActive = async (req, res, next) => {
  try {
    const user = await prisma.users.update({
      where: { id: req.params.id },
      data: { is_active: req.body.is_active },
      select: { id: true, username: true, is_active: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const forceKillUserSession = async (req, res, next) => {
  try {
    await DockerService.killContainer(req.params.id);
    res.json({ message: 'User session terminated' });
  } catch (err) {
    next(err);
  }
};

const listActiveContainers = async (req, res, next) => {
  try {
    const containers = await docker.listContainers({ filters: { name: [containerNamePrefix] } });

    const items = await Promise.all(
      containers.map(async (item) => {
        let cpu = 0;
        let memoryUsage = 0;
        let memoryLimit = 0;

        try {
          const stats = await docker.getContainer(item.Id).stats({ stream: false });
          const cpuDelta = (stats.cpu_stats?.cpu_usage?.total_usage || 0) - (stats.precpu_stats?.cpu_usage?.total_usage || 0);
          const sysDelta = (stats.cpu_stats?.system_cpu_usage || 0) - (stats.precpu_stats?.system_cpu_usage || 0);
          const onlineCpus = stats.cpu_stats?.online_cpus || 1;
          cpu = sysDelta > 0 ? (cpuDelta / sysDelta) * onlineCpus * 100 : 0;

          memoryUsage = stats.memory_stats?.usage || 0;
          memoryLimit = stats.memory_stats?.limit || 0;
        } catch {
          // ignore stats failure, return baseline info
        }

        const fullName = (item.Names?.[0] || '').replace(/^\//, '');
        const userId = fullName.startsWith(containerNamePrefix) ? fullName.replace(containerNamePrefix, '') : null;

        return {
          id: item.Id,
          name: fullName,
          userId,
          status: item.Status,
          cpuPercent: Number(cpu.toFixed(2)),
          memoryUsage,
          memoryLimit,
        };
      })
    );

    res.json({ containers: items });
  } catch (err) {
    next(err);
  }
};

const systemStats = async (req, res, next) => {
  try {
    const [totalUsers, containers] = await Promise.all([
      prisma.users.count(),
      docker.listContainers({ filters: { name: ['bhackme-user-'] } }),
    ]);
    res.json({ totalUsers, activeContainers: containers.length });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  listChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  toggleChapterPublish,
  reorderChapters,
  listLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  listTasks,
  createTask,
  testTaskValidation,
  listUsers,
  getUserProgress,
  setUserActive,
  forceKillUserSession,
  listActiveContainers,
  systemStats,
};
