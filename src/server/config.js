'use strict';

const PORT = process.env.PORT || 3000;
const __ENV__ = process.env.NODE_ENV || 'development';

module.exports = {
    PORT,
    __ENV__,
};
