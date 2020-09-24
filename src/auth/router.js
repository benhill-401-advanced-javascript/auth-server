'use strict';

const express = require('express');
const basicAuth = require('./middleware/basic.js');
const users = require('./models/users-model.js');
const router = express.Router();
const bearer = require('./middleware/bearer.js');



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

module.exports = router;
