'use strict';

const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./models/schemas');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./app')(db);

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});