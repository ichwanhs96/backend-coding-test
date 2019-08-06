'use debug';

const winston = require('winston');

const options = {
    file: {
        level: 'info',
        filename: './app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    }
};

const logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file)
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;