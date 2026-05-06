require('dotenv').config();
const app = require('./app');
const logger = require('./logs/winstonLogger');
const notificationService = require('./services/notificationService');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`[SERVER] Server running on port ${PORT}`);
  
  // Start polling external API for notifications
  notificationService.startPolling();
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('[SERVER] Shutting down gracefully...');
  notificationService.stopPolling();
  server.close(() => {
    logger.info('[SERVER] Server closed.');
    process.exit(0);
  });
});
