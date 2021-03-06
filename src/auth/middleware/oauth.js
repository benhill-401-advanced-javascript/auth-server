'use strict';

const superagent = require('superagent');

const users = require('../models/users-model.js');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const STATE = process.env.STATE
const TOKEN_SERVER = process.env.TOKEN_SERVER
const REDIRECT_URI = process.env.REDIRECT_URI
const REMOTE_API = process.env.REMOTE_API

module.exports = async (req, res, next) => {
  let code = req.query.code;
  console.log('(1) CODE:', code);

  //Exchanges code for a token
  let remoteToken = await exchangeCodeForToken(code);
  console.log('(2)', remoteToken);

  //Get user info from Github
  let remoteUser = await getRemoteUser(remoteToken);
  console.log('(3)', remoteUser);

  //Connect with database
  let localUser = await getLocalUse(remoteUser.login);
  console.log('(4)', localUser);
  req.user = localUser.user;
  req.token = localUser.token;
  next();
}

async function exchangeCodeForToken(code) {
  let tokenResponse = await
    superagent.post(TOKEN_SERVER)
      .send({
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        state: STATE,
        grant_type: 'authorization_code'
      });
  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUser(token) {
  let userResponse = await
    superagent.get(REMOTE_API)
      .set('user-agent', 'express-server')
      .set('Authorization', `token ${token}`)

  let user = userResponse.body;
  return user;
}

async function getLocalUser(userId) {
  let findUserId = await
    // Is this userId in our mongo database?
    users.findById({ username: userId });
  // if not, add it
  if (!findUserId) {
    let obj = {
      username: userId,
      password: Math.random()
    }
    let record = new users(obj);
    let newUser = await record.save();
    let token = record.generateToken();
    let output = {
      user: newUser,
      token: token
    }
    return output;
  } else {
    let output = {
      user: findUserId.username,
      token: findUserId.generateToken()
    }
  }
  // store a hashed Password

  // i.e. users.createOrUpdateFromOauth(userId).then() ...

  // After save, or if you found a user ...
  // Generate a token
  // set req.user to be that user object
  // set req.token to be OUR token
}
