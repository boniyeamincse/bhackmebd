const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/database', () => ({
  tasks: {
    findUnique: jest.fn(),
  },
  user_progress: {
    findMany: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn(),
  },
  users: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../src/config/redis', () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  setex: jest.fn(),
  del: jest.fn(),
  on: jest.fn(),
}));

const prisma = require('../src/config/database');
const app = require('../src/app');

describe('Progress Endpoints', () => {
  const token = jwt.sign({ id: 'u1', role: 'student' }, 'test-jwt-secret', { expiresIn: '15m' });

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/progress returns mapped progress structure', async () => {
    prisma.user_progress.findMany.mockResolvedValue([
      {
        chapter_id: 'c1',
        lesson_id: 'l1',
        task_id: 't1',
        status: 'completed',
        attempts: 1,
        xp_earned: 25,
        completed_at: null,
        lesson: { chapter_id: 'c1' },
        task: { lesson_id: 'l1' },
      },
    ]);

    const res = await request(app)
      .get('/api/progress')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.progress[0]).toMatchObject({
      chapterId: 'c1',
      lessonId: 'l1',
      taskId: 't1',
      status: 'completed',
    });
  });

  it('POST /api/progress/validate awards XP on success', async () => {
    prisma.tasks.findUnique.mockResolvedValue({
      id: 't1',
      xp_reward: 25,
      validation_type: 'contains',
      expected_output: 'passwd',
      validation_rule: null,
      hint: 'Try ls /etc',
    });

    prisma.users.update
      .mockResolvedValueOnce({ total_xp: 25, level: 'beginner' })
      .mockResolvedValueOnce({ total_xp: 25, level: 'beginner' });
    prisma.user_progress.upsert.mockResolvedValue({});
    prisma.user_progress.count.mockResolvedValue(1);
    prisma.users.findUnique.mockResolvedValue({ badges: [], level: 'beginner' });

    const res = await request(app)
      .post('/api/progress/validate')
      .set('Authorization', `Bearer ${token}`)
      .send({ taskId: 't1', output: 'passwd hostname' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.xp).toBe(25);
  });

  it('POST /api/progress/validate increments attempts on fail', async () => {
    prisma.tasks.findUnique.mockResolvedValue({
      id: 't1',
      xp_reward: 25,
      validation_type: 'contains',
      expected_output: 'passwd',
      validation_rule: null,
      hint: 'Try ls /etc',
    });
    prisma.user_progress.upsert.mockResolvedValue({ attempts: 2 });

    const res = await request(app)
      .post('/api/progress/validate')
      .set('Authorization', `Bearer ${token}`)
      .send({ taskId: 't1', output: 'no-match' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.attempts).toBe(2);
  });

  it('GET /api/progress/stats includes streak and badgeCount', async () => {
    prisma.users.findUnique.mockResolvedValue({
      total_xp: 1200,
      level: 'intermediate',
      badges: ['First Step'],
    });

    const redis = require('../src/config/redis');
    redis.get.mockResolvedValue('3');

    const res = await request(app)
      .get('/api/progress/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.stats).toMatchObject({
      total_xp: 1200,
      level: 'intermediate',
      badgeCount: 1,
      streak: 3,
    });
  });

  it('GET /api/leaderboard supports pagination', async () => {
    prisma.users.findMany.mockResolvedValue([
      { username: 'a', total_xp: 100, level: 'beginner', avatar_url: null },
    ]);
    prisma.users.count.mockResolvedValue(1);

    const res = await request(app).get('/api/leaderboard?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 10, total: 1, totalPages: 1 });
    expect(res.body.leaderboard).toHaveLength(1);
  });
});
