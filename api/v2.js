'use strict';

/**
 * API Router Module (V2)
 * Integrates with various models through a common Interface (.get(), .post(), .put(), .delete())
 * @module src/api/v2
 */
const cwd = process.cwd();
const express = require('express');
const modelFinder = require(`${cwd}/middleware/model-finder.js`);
const router = express.Router();
const bearer = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');

// Evaluate the model, dynamically
router.param('model', modelFinder.load);
// Models List
router.get('/models', (request, response) => {
  console.log('hi there');
  modelFinder.list()
    .then(models => response.status(200).json(models));
});
// JSON Schema
router.get('/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});
// API Routes
/**
 * Get a list of records for a given model
 * Model must be a proper model, located within the ../models folder
 * @route GET /{model}
 * @param {model} model.path - Model Name
 * @security basicAuth
 * @returns {object} 200 { count: 2, results: [ {}, {} ] }
 * @returns {Error}  500 - Server error
 */
router.get('/:model', handleGetAll);
/**
 * @route POST /:model
 * Model must be a proper model, located within the ../models folder
 * @param {model} model.path.required
 * @returns {object} 200 - Count of results with an array of results
 * @returns {Error}  500 - Unexpected error
 */

router.post('/:model', bearer, permissions('create'), handlePost);
router.get('/:model', bearer, permissions('read'), handleGetAll);
router.get('/:model/:id', bearer, permissions('read'), handleGetOne);
router.put('/:model/:id', bearer, permissions('update'), handlePut);
router.delete('/:model/:id', bearer, permissions('delete'), handleDelete);

// Route Handlers
async function handleGetAll(request, response, next) {
  try {
    let list = await request.model.get(request.query);
    const output = {
      count: list.length,
      results: list,
    };
    response.status(200).json(output);
  } catch (err) {
    next(err);
  }
}
async function handleGetOne(request, response, next) {
  try {
    let result = await request.model.get({ _id: request.params.id });
    response.status(200).json(result[0]);
  } catch (err) {
    next(err);
  }
}
async function handlePost(request, response, next) {
  try {
    let result = await request.model.create(request.body);
    response.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
async function handlePut(request, response, next) {
  try {
    let result = await request.model.update(request.params.id, request.body);
    response.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
async function handleDelete(request, response, next) {
  try {
    let result = await request.model.delete(request.params.id);
    response.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
module.exports = router;