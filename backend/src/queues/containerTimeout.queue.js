const { Queue, Worker } = require('bullmq');
const redis = require('../config/redis');
const logger = require('../utils/logger');

const QUEUE_NAME = 'container-idle-timeout';

if (process.env.NODE_ENV === 'test') {
  const noop = async () => undefined;
  module.exports = {
    queue: { close: noop },
    scheduleIdleKill: noop,
    cancelIdleKill: noop,
    initContainerTimeoutWorker: () => ({ close: noop }),
  };
} else {
  const queue = new Queue(QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: 50,
    },
  });

  const scheduleIdleKill = async (userId, containerId, timeoutSeconds) => {
    await queue.add(
      'idle-kill',
      { userId, containerId },
      {
        jobId: String(userId),
        delay: timeoutSeconds * 1000,
      }
    );
  };

  const cancelIdleKill = async (userId) => {
    const job = await queue.getJob(String(userId));
    if (job) await job.remove();
  };

  const initContainerTimeoutWorker = () => {
    const worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        const DockerService = require('../services/docker.service');
        const { userId, containerId } = job.data;
        await DockerService.killContainer(containerId, { isContainerId: true, userId });
        logger.info(`Idle timeout killed container ${containerId} for user ${userId}`);
      },
      { connection: redis }
    );

    worker.on('failed', (job, err) => {
      logger.error('Idle timeout worker failed', {
        jobId: job?.id,
        userId: job?.data?.userId,
        message: err.message,
      });
    });

    worker.on('error', (err) => {
      logger.error('Idle timeout queue error', { message: err.message });
    });

    return worker;
  };

  module.exports = {
    queue,
    scheduleIdleKill,
    cancelIdleKill,
    initContainerTimeoutWorker,
  };
}
