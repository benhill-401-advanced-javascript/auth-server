'use strict';

module.exports = (req, res, next) => {
  let err = { error: 'Resource Not Found' };
  res.status(404).json(err)
}