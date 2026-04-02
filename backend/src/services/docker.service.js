const docker = require('../config/docker');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const ContainerTimeoutQueue = require('../queues/containerTimeout.queue');

const IMAGE = process.env.USER_CONTAINER_IMAGE || 'boniyeamin/bhackme-terminal:latest';
const MEMORY = process.env.CONTAINER_MEMORY_LIMIT || '128m';
const CPU = parseFloat(process.env.CONTAINER_CPU_LIMIT || '0.5');
const TIMEOUT = parseInt(process.env.CONTAINER_IDLE_TIMEOUT || '3600', 10);
const MAX_CONTAINERS = parseInt(process.env.MAX_CONCURRENT_CONTAINERS || '50', 10);
const CONTAINER_NETWORK = process.env.CONTAINER_NETWORK || 'terminal-net';

const containerName = (userId) => `bhackme-user-${userId}`;
const sessionKey = (userId) => `session:${userId}`;

const waitQueue = [];

const countActiveContainers = async () => {
  const running = await docker.listContainers({
    all: false,
    filters: { name: ['bhackme-user-'] },
  });
  return running.length;
};

const waitForCapacity = () => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    const idx = waitQueue.indexOf(resolve);
    if (idx !== -1) waitQueue.splice(idx, 1);
    reject(new Error('Terminal pool busy. Please retry in a few seconds.'));
  }, 30000);

  const wrappedResolve = () => {
    clearTimeout(timer);
    resolve();
  };

  waitQueue.push(wrappedResolve);
});

const notifyCapacityFreed = () => {
  const next = waitQueue.shift();
  if (next) next();
};

const isMissingNetworkError = (err) => /network\s+.+\s+not found/i.test(String(err?.message || ''));

const waitUntilCapacity = async () => {
  while (true) {
    const active = await countActiveContainers();
    if (active < MAX_CONTAINERS) return;
    await waitForCapacity();
  }
};

const readSession = async (userId) => {
  const raw = await redis.get(sessionKey(userId));
  return raw ? JSON.parse(raw) : null;
};

const writeSession = async (userId, metadata) => {
  const payload = {
    ...metadata,
    expiresAt: new Date(Date.now() + TIMEOUT * 1000).toISOString(),
  };
  await redis.set(sessionKey(userId), JSON.stringify(payload), 'EX', TIMEOUT);
  return payload;
};

const getOrCreateContainer = async (userId) => {
  const cached = await readSession(userId);
  if (cached?.containerId) {
    try {
      const container = docker.getContainer(cached.containerId);
      const inspect = await container.inspect();
      await writeSession(userId, {
        containerId: cached.containerId,
        containerIp: inspect.NetworkSettings?.Networks?.[CONTAINER_NETWORK]?.IPAddress || cached.containerIp || null,
      });
      await ContainerTimeoutQueue.scheduleIdleKill(userId, cached.containerId, TIMEOUT);
      return container;
    } catch {
      // Container gone — create fresh
    }
  }

  // If Redis session is missing but Docker still has a named container, reuse it.
  const existing = await docker.listContainers({
    all: true,
    filters: { name: [containerName(userId)] },
  });

  if (existing.length > 0) {
    const existingContainer = docker.getContainer(existing[0].Id);
    try {
      const info = await existingContainer.inspect();

      if (!info.State?.Running) {
        await existingContainer.start();
      }

      const refreshed = await existingContainer.inspect();
      const containerIp =
        refreshed.NetworkSettings?.Networks?.[CONTAINER_NETWORK]?.IPAddress || null;

      await writeSession(userId, { containerId: existingContainer.id, containerIp });
      await ContainerTimeoutQueue.scheduleIdleKill(userId, existingContainer.id, TIMEOUT);

      return existingContainer;
    } catch (err) {
      if (!isMissingNetworkError(err)) throw err;
      await existingContainer.remove({ force: true }).catch(() => null);
    }
  }

  await waitUntilCapacity();

  let container;
  try {
    container = await docker.createContainer({
      Image: IMAGE,
      name: containerName(userId),
      HostConfig: {
        Memory: parseMemory(MEMORY),
        MemorySwap: parseMemory(MEMORY),
        NanoCpus: Math.floor(CPU * 1e9),
        PidsLimit: 50,
        ReadonlyRootfs: true,
        Tmpfs: { '/tmp': 'size=50m,noexec', '/home/hacker': 'size=100m' },
        NetworkMode: CONTAINER_NETWORK,
        SecurityOpt: ['no-new-privileges'],
        CapDrop: ['ALL'],
      },
      Tty: true,
      OpenStdin: true,
    });
  } catch (err) {
    // Handle race condition where another request created same named container.
    if (err?.statusCode === 409) {
      const byName = await docker.listContainers({
        all: true,
        filters: { name: [containerName(userId)] },
      });

      if (byName.length > 0) {
        container = docker.getContainer(byName[0].Id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }

  const current = await container.inspect();
  if (!current.State?.Running) {
    try {
      await container.start();
    } catch (err) {
      if (!isMissingNetworkError(err)) throw err;

      await container.remove({ force: true }).catch(() => null);
      container = await docker.createContainer({
        Image: IMAGE,
        name: containerName(userId),
        HostConfig: {
          Memory: parseMemory(MEMORY),
          MemorySwap: parseMemory(MEMORY),
          NanoCpus: Math.floor(CPU * 1e9),
          PidsLimit: 50,
          ReadonlyRootfs: true,
          Tmpfs: { '/tmp': 'size=50m,noexec', '/home/hacker': 'size=100m' },
          NetworkMode: CONTAINER_NETWORK,
          SecurityOpt: ['no-new-privileges'],
          CapDrop: ['ALL'],
        },
        Tty: true,
        OpenStdin: true,
      });
      await container.start();
    }
  }
  const inspect = await container.inspect();
  const containerIp = inspect.NetworkSettings?.Networks?.[CONTAINER_NETWORK]?.IPAddress || null;

  await writeSession(userId, { containerId: container.id, containerIp });
  await ContainerTimeoutQueue.scheduleIdleKill(userId, container.id, TIMEOUT);

  logger.info(`Container started for user ${userId}: ${container.id}`);
  return container;
};

const killContainer = async (identifier, options = {}) => {
  const isContainerId = options.isContainerId === true;

  let userId = isContainerId ? options.userId || null : identifier;
  let containerId = isContainerId ? identifier : null;

  if (!isContainerId) {
    const session = await readSession(identifier);
    containerId = session?.containerId || null;
  }

  if (containerId) {
    try {
      const c = docker.getContainer(containerId);
      await c.stop({ t: 5 }).catch(() => null);
      await c.remove({ force: true }).catch(() => null);
    } catch {
      // Container already removed
    }
  }

  if (userId) {
    await redis.del(sessionKey(userId));
    await ContainerTimeoutQueue.cancelIdleKill(userId);
  }

  notifyCapacityFreed();
};

const getContainerStatus = async (userId) => {
  const session = await readSession(userId);
  if (!session?.containerId) return { running: false };

  try {
    const info = await docker.getContainer(session.containerId).inspect();
    return {
      running: info.State.Running,
      containerId: session.containerId,
      containerIp: info.NetworkSettings?.Networks?.[CONTAINER_NETWORK]?.IPAddress || session.containerIp || null,
      expiresAt: session.expiresAt,
    };
  } catch {
    return { running: false };
  }
};

const updateLastActive = async (userId) => {
  const session = await readSession(userId);
  if (!session?.containerId) return;

  await writeSession(userId, {
    containerId: session.containerId,
    containerIp: session.containerIp || null,
  });

  await ContainerTimeoutQueue.scheduleIdleKill(userId, session.containerId, TIMEOUT);
};

const parseMemory = (str) => {
  if (str.endsWith('m')) return parseInt(str) * 1024 * 1024;
  if (str.endsWith('g')) return parseInt(str) * 1024 * 1024 * 1024;
  return parseInt(str);
};

module.exports = { getOrCreateContainer, killContainer, getContainerStatus, updateLastActive };
