const prisma = require('../../config/database');
const { AppError } = require('../../utils/errors');

const listChapters = async (req, res, next) => {
  try {
    const chapters = await prisma.chapters.findMany({
      where: { is_published: true },
      orderBy: { order_index: 'asc' },
    });
    res.json({ chapters });
  } catch (err) {
    next(err);
  }
};

const getChapter = async (req, res, next) => {
  try {
    const chapter = await prisma.chapters.findUnique({ where: { id: req.params.id } });
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
