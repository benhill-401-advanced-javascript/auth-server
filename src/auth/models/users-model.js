'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const secret = "sauce";

const users = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'guest', enum: ['guest', 'author', 'editor', 'admin'] }
})

const roles = {
  guest: ['read'],
  author: ['read', 'create'],
  editor: ['read', 'update', 'delete'],
  admin: ['read', 'create', 'update', 'delete ']
};

users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
  console.log('The password is', this.password);
});

// Works with an instance, ie. userRecord.generateToken()
users.methods.generateToken = function () {
  let tokenObject = {
    username: this.username,
  }
  let token = jwt.sign(tokenObject, process.env.SECRET)
  return token;
}

// Works without an instance, ie. users.validateBasic()
users.statics.validateBasic = async function (username, password) {

  // Look up the user by the username
  let user = await this.findOne({ username: username });

  // Compare of the password sent against the password in the db
  let isValid = await bcrypt.compare(password, user.password)

  if (isValid) { return user; }
  else { return undefined; }
}

users.statics.validateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const user = this.findOne({ username: parsedToken.username })
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = mongoose.model('users', users);