const docker = require('../config/docker');
const redis = require('../config/redis');
const logger = require('../utils/logger');

const IMAGE = process.env.USER_CONTAINER_IMAGE || 'bhackme/terminal:latest';
const MEMORY = process.env.CONTAINER_MEMORY_LIMIT || '128m';
const CPU = parseFloat(process.env.CONTAINER_CPU_LIMIT || '0.5');
const TIMEOUT = parseInt(process.env.CONTAINER_IDLE_TIMEOUT || '3600', 10);

const containerName = (userId) => `bhackme-user-${userId}`;

const getOrCreateContainer = async (userId) => {
  const cached = await redis.get(`container:${userId}`);
  if (cached) {
    try {
      const container = docker.getContainer(cached);
      await container.inspect();
      return container;
    } catch {
      // Container gone — create fresh
    }
  }

  const container = await docker.createContainer({
    Image: IMAGE,
    name: containerName(userId),
    HostConfig: {
      Memory: parseMemory(MEMORY),
      MemorySwap: parseMemory(MEMORY),
      NanoCpus: Math.floor(CPU * 1e9),
      PidsLimit: 50,
      ReadonlyRootfs: true,
      Tmpfs: { '/tmp': 'size=50m,noexec', '/home/hacker': 'size=100m' },
      NetworkMode: 'terminal-net',
      SecurityOpt: ['no-new-privileges'],
      CapDrop: ['ALL'],
    },
    Tty: true,
    OpenStdin: true,
  });

  await container.start();
  await redis.setex(`container:${userId}`, TIMEOUT, container.id);
  logger.info(`Container started for user ${userId}: ${container.id}`);
  return container;
};

const killContainer = async (userId) => {
  const containerId = await redis.get(`container:${userId}`);
  if (containerId) {
    try {
      const c = docker.getContainer(containerId);
      await c.kill();
      await c.remove();
    } catch { /* already gone */ }
    await redis.del(`container:${userId}`);
  }
};

const getContainerStatus = async (userId) => {
  const containerId = await redis.get(`container:${userId}`);
  if (!containerId) return { running: false };
  try {
    const info = await docker.getContainer(containerId).inspect();
    return { running: info.State.Running, containerId };
  } catch {
    return { running: false };
  }
};

const updateLastActive = async (userId) => {
  const containerId = await redis.get(`container:${userId}`);
  if (containerId) await redis.expire(`container:${userId}`, TIMEOUT);
};

const parseMemory = (str) => {
  if (str.endsWith('m')) return parseInt(str) * 1024 * 1024;
  if (str.endsWith('g')) return parseInt(str) * 1024 * 1024 * 1024;
  return parseInt(str);
};

module.exports = { getOrCreateContainer, killContainer, getContainerStatus, updateLastActive };
