'use strict';

const express = require('express');
const users = require('./models/users-model.js');
const basicAuth = require('./middleware/basic.js');
const bearer = require('./middleware/bearer.js');
const oauth = require('./middleware/oauth.js');
const router = express.Router();


router.post('/signup', async (req, res, next) => {
  try {
    // username, password, email, etc ..
    // will be on req.body

    // use the users module to create a new user

    // Create an object that looks like the data model shape
    let obj = {
      username: req.body.username,
      password: req.body.password
    }

    // Create a new instance from the schema, using that object
    let record = new users(obj);

    // Save that instance to the database
    let newUser = await record.save();

    let token = record.generateToken();

    // Prove it
    res.status(201).send(token);
  } catch (err) {
    next(err.message);
  }
});

router.post('/signin', basicAuth, async (req, res, next) => {
  let obj = {
    token: req.token,
    user: req.user
  }
  res.status(200).send(obj);
});

router.get('/secret', bearer, (req, res, next) => {
  res.status(200).send(`Welcome, ${req.user.username}`)
})

// you need to bring in oath and use .put probably or something
router.get('/oauth', oauth, bearer, (req, res, next) => {
  res.status(200).send(`User ID present, ${req.user.username}`)
})
//create/update a local user account in our db, and return an object with a re-authentication/bearer token and the user object

module.exports = router;
