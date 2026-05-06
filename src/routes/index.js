const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Define API routes
router.get('/notifications/top', notificationController.getTopNotifications);
router.get('/notifications/all', notificationController.getAllNotifications);
router.get('/health', notificationController.getHealthStatus);

module.exports = router;
