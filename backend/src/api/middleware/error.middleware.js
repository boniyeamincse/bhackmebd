const logger = require('../../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    logger.error(`[${req.method}] ${req.path} — ${message}`, { stack: err.stack });
  }

  res.status(status).json({ error: message });
};

module.exports = { errorMiddleware };
