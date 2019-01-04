'use strict';

const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src/client');
const DIST_DIR = path.resolve(__dirname, '../dist');

const __ENV__ = process.env.NODE_ENV || 'development';
const __PROD__ = __ENV__ === 'production';

module.exports = {
    SRC_DIR,
    DIST_DIR,

    __ENV__,
    __PROD__,
};
