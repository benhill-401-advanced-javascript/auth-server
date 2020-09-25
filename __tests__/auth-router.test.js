'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server.js');
const request = supergoose(server.app);
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Proof of life test', () => {
  test('Should give a 404 for bad route', async () => {
    let response = await request.get('/bad');
    expect(response.status).toEqual(404);
  });
});