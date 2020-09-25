'use strict';

const express = require('express');
const base64 = require('base-64');
const cors = require('cors');

// const users = require('./auth/models/users-model.js');
const router = require('./auth/router.js');

const notFoundHandler = require('../middleware/404.js');
const errorHandler = require('../middleware/500.js');

const app = express();

// global middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route definitions
app.use(router);

// 404 / not found handler
app.use('*', notFoundHandler)
// 500 - last express route!
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => app.listen(port, console.log('Listening on Port', port))
}
