'use strict';

module.exports = (app, db) => {
    app.use(require('./controllers/health')());
    app.use(require('./controllers/rides')(db));
};