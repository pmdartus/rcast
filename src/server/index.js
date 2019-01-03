'use strict';

const server = require('./server');

const { PORT } = require('./config');
const { logger } = require('./utils/logger');

server.listen(PORT, () => {
    logger.info(`Application available at: http://localhost:${PORT}`);
});