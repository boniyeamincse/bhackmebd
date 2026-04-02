const prisma = require('../../config/database');
const { AppError } = require('../../utils/errors');

const listChapters = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const skip = (page - 1) * limit;

    const [chapters, total] = await Promise.all([
      prisma.chapters.findMany({
        where: { is_published: true },
        orderBy: { order_index: 'asc' },
        skip,
        take: limit,
      }),
      prisma.chapters.count({ where: { is_published: true } }),
    ]);

    res.json({
      chapters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getChapter = async (req, res, next) => {
  try {
    const chapter = await prisma.chapters.findUnique({
      where: { id: req.params.id },
      include: {
        lessons: {
          where: { is_published: true },
          orderBy: { order_index: 'asc' },
          select: {
            id: true,
            title: true,
            title_bn: true,
            order_index: true,
            xp_reward: true,
          },
        },
      },
    });
    if (!chapter) throw new AppError('Chapter not found', 404);
    res.json({ chapter });
  } catch (err) {
    next(err);
  }
};

const getChapterLessons = async (req, res, next) => {
  try {
    const lessons = await prisma.lessons.findMany({
      where: { chapter_id: req.params.id, is_published: true },
      orderBy: { order_index: 'asc' },
    });
    res.json({ lessons });
  } catch (err) {
    next(err);
  }
};

const getLesson = async (req, res, next) => {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: req.params.id },
      include: { tasks: { orderBy: { order_index: 'asc' } } },
    });
    if (!lesson) throw new AppError('Lesson not found', 404);
    res.json({ lesson });
  } catch (err) {
    next(err);
  }
};

module.exports = { listChapters, getChapter, getChapterLessons, getLesson };
