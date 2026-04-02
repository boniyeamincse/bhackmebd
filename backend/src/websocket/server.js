const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { terminalHandler } = require('./handlers/terminal.handler');
const { progressHandler } = require('./handlers/progress.handler');
const logger = require('../utils/logger');

const initWebSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.APP_URL, credentials: true },
  });

  // JWT auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    logger.info(`Socket handshake attempt. Token present: ${!!token}`);
    
    if (!token) {
      logger.error('Socket authentication failed: Token missing');
      return next(new Error('Authentication required'));
    }
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      logger.info(`Socket authenticated for user: ${socket.user.id}`);
      next();
    } catch (err) {
      logger.error(`Socket authentication failed: ${err.message}`);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.user.id}`);
    terminalHandler(io, socket);
    progressHandler(io, socket);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

module.exports = { initWebSocket };
