const prisma = require('../../config/database');
const docker = require('../../config/docker');

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

const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      select: { id: true, username: true, email: true, role: true, level: true, total_xp: true, is_active: true, created_at: true },
      orderBy: { created_at: 'desc' },
    });
    res.json({ users });
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

module.exports = { createChapter, updateChapter, deleteChapter, createLesson, updateLesson, listUsers, systemStats };
