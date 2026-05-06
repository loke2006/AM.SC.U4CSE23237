const notificationService = require('../services/notificationService');
const logger = require('../logs/winstonLogger');

exports.getTopNotifications = (req, res, next) => {
  try {
    const top10 = notificationService.getTop10();
    res.json({
      success: true,
      count: top10.length,
      data: top10
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllNotifications = (req, res, next) => {
  try {
    const all = notificationService.getAll();
    res.json({
      success: true,
      count: all.length,
      data: all
    });
  } catch (error) {
    next(error);
  }
};

exports.getHealthStatus = (req, res) => {
  res.json({
    success: true,
    status: 'up',
    timestamp: new Date().toISOString()
  });
};
