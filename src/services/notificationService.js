const axios = require('axios');
const MinHeap = require('../dataStructures/MinHeap');
const logger = require('../logs/winstonLogger');

class NotificationService {
  constructor() {
    this.allNotifications = [];
    this.seenIds = new Set();
    this.minHeap = new MinHeap(10);
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://20.207.122.201/evaluation-service/notifications';
    this.pollIntervalMs = parseInt(process.env.POLL_INTERVAL_MS, 10) || 30000;
    this.intervalId = null;
  }

  async fetchNotifications() {
    try {
      logger.info(`[FETCH] Fetching notifications from ${this.apiUrl}`);
      const response = await axios.get(this.apiUrl);
      const notifications = response.data;
      
      let newCount = 0;

      if (Array.isArray(notifications)) {
        for (const notif of notifications) {
          if (!this.seenIds.has(notif.ID)) {
            this.seenIds.add(notif.ID);
            this.allNotifications.push(notif);
            this.minHeap.insert(notif);
            newCount++;
          }
        }
      }

      logger.info(`[FETCH] Processed ${notifications.length} items. Added ${newCount} new notifications.`);
    } catch (error) {
      logger.error(`[FETCH ERROR] Failed to fetch notifications: ${error.message}`);
    }
  }

  startPolling() {
    if (this.intervalId) return;
    // Initial fetch
    this.fetchNotifications();
    
    // Setup interval
    this.intervalId = setInterval(() => {
      this.fetchNotifications();
    }, this.pollIntervalMs);
    
    logger.info(`[SERVICE] Started notification polling every ${this.pollIntervalMs}ms`);
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info(`[SERVICE] Stopped notification polling`);
    }
  }

  getTop10() {
    return this.minHeap.getTopElements();
  }

  getAll() {
    return this.allNotifications;
  }
}

// Export as a singleton
const notificationService = new NotificationService();
module.exports = notificationService;
