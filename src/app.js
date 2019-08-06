'use strict';

const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const routes = require('./routes');
const logger = require('./logger');
const swaggerDocument = require('../swagger.json');

module.exports = (db) => {
    app.use(jsonParser);
    app.use(morgan('combined', { stream: logger.stream }));

    routes(app, db);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    // as per express validation v0.3.0 this needed for express validation library to throw error and returns as json
    app.use(function(err, req, res, next){
        logger.error(err);
        res.status(400).json(err);
    });

    return app;
};