'use strict';

const base64 = require('base-64');
const users = require('../models/users-model.js');

module.exports = async (req, res, next) => {
  try {
    // Get the username and password from the user
    // It will be in the headers
    let authorization = req.headers.authorization;
    let encoded = authorization.split(' ')[1]
    let creds = base64.decode(encoded);
    let [username, password] = creds.split(":");

    // Get user instance from the model, if we can.
    let userRecord = await users.validateBasic(username, password);

    // If it's good, send a token
    req.token = userRecord.generateToken();
    req.user = userRecord;
    next();
  } catch (err) {
    next(err.message);
  }

}
