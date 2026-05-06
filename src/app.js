const express = require('express');
const requestLogger = require('./middleware/loggerMiddleware');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

// Setup routes
app.use('/', routes);

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
