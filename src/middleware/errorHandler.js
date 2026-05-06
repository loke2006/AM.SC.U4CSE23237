const logger = require('../logs/winstonLogger');

const errorHandler = (err, req, res, next) => {
  logger.error(`[ERR] ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
