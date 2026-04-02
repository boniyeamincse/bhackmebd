require('dotenv').config();
const app = require('./app');
const { createServer } = require('http');
const { initWebSocket } = require('./websocket/server');
const logger = require('./utils/logger');
const { initContainerTimeoutWorker, queue } = require('./queues/containerTimeout.queue');

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);
initWebSocket(httpServer);
const timeoutWorker = initContainerTimeoutWorker();

httpServer.listen(PORT, () => {
  logger.info(`B-HackMe backend running on port ${PORT}`);
});

const shutdown = async () => {
  logger.info('Shutting down backend...');
  await timeoutWorker.close();
  await queue.close();
  httpServer.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
