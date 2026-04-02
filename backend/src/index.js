require('dotenv').config();
const app = require('./app');
const { createServer } = require('http');
const { initWebSocket } = require('./websocket/server');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);
initWebSocket(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`B-HackMe backend running on port ${PORT}`);
});
