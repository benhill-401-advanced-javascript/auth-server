'use strict';


const users = require('../models/users-model.js');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) { next('Invalid Login') }

    let token = req.headers.authorization.split(' ')[1];
    let validUser = await users.validateWithToken(token);

    req.user = validUser;
    req.token = token;
    next();

  } catch (err) {
    next(err.message);
  }

}

