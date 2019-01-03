'use strict';

const NodeCache = require('node-cache');

const CACHE_INSTANCES = [];

class Cache extends NodeCache {
    constructor() {
        super();
        CACHE_INSTANCES.push(this);
    }
}

function _flushAllCaches() {
    for (const cache of CACHE_INSTANCES) {
        cache.flushAll();
    }
}

module.exports = {
    Cache,
    _flushAllCaches,
};
