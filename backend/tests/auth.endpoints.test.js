const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../src/config/database', () => ({
  users: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

jest.mock('../src/config/redis', () => ({
  setex: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  on: jest.fn(),
}));

const prisma = require('../src/config/database');
const redis = require('../src/config/redis');
const app = require('../src/app');

describe('Auth Endpoints', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/auth/register creates a user with hashed password', async () => {
    prisma.users.findFirst.mockResolvedValue(null);
    prisma.users.create.mockResolvedValue({
      id: 'u1',
      username: 'boni99',
      email: 'boni@example.com',
      role: 'student',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'boni99', email: 'boni@example.com', password: 'StrongPass123' });

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe('boni99');
    expect(prisma.users.create).toHaveBeenCalled();

    const createArg = prisma.users.create.mock.calls[0][0].data;
    expect(createArg.password_hash).toBeDefined();
    expect(createArg.password_hash).not.toBe('StrongPass123');
  });

  it('POST /api/auth/register returns 409 for duplicate user', async () => {
    prisma.users.findFirst.mockResolvedValue({ id: 'existing' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'boni99', email: 'boni@example.com', password: 'StrongPass123' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already taken');
  });

  it('POST /api/auth/login returns access and refresh tokens', async () => {
    const hashed = await bcrypt.hash('StrongPass123', 10);
    prisma.users.findUnique.mockResolvedValue({
      id: 'u1',
      username: 'boni99',
      email: 'boni@example.com',
      password_hash: hashed,
      role: 'student',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'boni@example.com', password: 'StrongPass123' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(redis.setex).toHaveBeenCalled();
  });

  it('POST /api/auth/login rejects invalid credentials', async () => {
    prisma.users.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'boni@example.com', password: 'WrongPass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid email or password');
  });

  it('POST /api/auth/refresh returns a new access token', async () => {
    const refreshToken = jwt.sign({ id: 'u1' }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    redis.get.mockResolvedValue(refreshToken);
    prisma.users.findUnique.mockResolvedValue({ id: 'u1', role: 'student' });

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /api/auth/logout deletes refresh token from Redis', async () => {
    const token = jwt.sign({ id: 'u1', role: 'student' }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.status).toBe(200);
    expect(redis.del).toHaveBeenCalledWith('refresh:u1');
  });

  it('GET /api/auth/me returns current user profile', async () => {
    const token = jwt.sign({ id: 'u1', role: 'student' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    prisma.users.findUnique.mockResolvedValue({
      id: 'u1',
      username: 'boni99',
      email: 'boni@example.com',
      full_name: null,
      avatar_url: null,
      role: 'student',
      level: 'beginner',
      total_xp: 0,
      badges: [],
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe('u1');
  });
});
