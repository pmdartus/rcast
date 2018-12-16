'use strict';

const server = require('./server');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Application available at: http://localhost:${PORT}`);
});