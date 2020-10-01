'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server.js');
const request = supergoose(server.app);
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Proof of life test', () => {
  test('Proof of life', () => {
    expect(true).toBeTruthy();
  });
});

describe('It should log a 404 for a route thats not present', () => {
  test('Should give a 404 for bad route', async () => {
    let response = await request.get('/bad');
    expect(response.status).toEqual(404);
  });
});

xdescribe('Post to /signup should work', () => {
  test('Should create a new user', async () => {
    let obj = {
      username: 'DK',
      password: 'metcalf',
      role: 'admin',
    }
    let response = await request.post('/signup').send(obj);
    expect(response.status).toEqual(200)
  });
});
