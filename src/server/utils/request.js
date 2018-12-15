'use strict';

const request = require('request');
const { promisify } = require('util');

module.exports = promisify(request);