const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' },
});

module.exports = { rateLimitMiddleware };
