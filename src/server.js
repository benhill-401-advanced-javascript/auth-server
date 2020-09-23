'use strict';

const express = require('express');
const users = require('./auth/models/users-model.js');
const base64 = require('base-64');
const router = require('./auth/router.js');

const app = express();

// global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);



// 404 / not found handler
app.use('*', (req, res, next) => {
  res.status(404).send('not found');
});

// Error Handler - last express route!
app.use((err, req, res, next) => {
  res.status(500).send(err);
})

module.exports = {
  app,
  start: (port) => app.listen(port, console.log('Listening on Port', port))
}
