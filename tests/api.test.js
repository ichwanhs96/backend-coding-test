'use strict';

const request = require('supertest');
const expect = require('expect.js');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/models/schemas');

const rideDataResource = {
	start_lat: '70',
	start_long: '70',
	end_lat: '50',
	end_long: '50',
	rider_name: 'bo chen fadlan',
	driver_name: 'moses lo gonzalez',
	driver_vehicle: 'harley davidson'
};

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('POST /rides', () => {
        it('should succssfully creates rides', (done) => {
            request(app)
                .post('/rides')
                .send(rideDataResource)
                .expect(200, (err, res) => {
                    if (err) return done(err);

                    expect(res.body[0].riderName).to.equal('bo chen fadlan');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if start lat < -90', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    start_lat: '-180'
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if start lat > 90', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    start_lat: '180'
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if start long < -180', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    start_long: '-181'
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if start long > 180', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    start_long: '181'
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if start long > 180', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    start_long: '181'
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if rider name is not string', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    rider_name: 1
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if driver name is not string', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    driver_name: 1
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should return 400 VALIDATION_ERROR if driver vehicle is not string', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    driver_vehicle: 1
                })
                .expect(400, (err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.error_code).to.equal('VALIDATION_ERROR');
                    return done();
                });
        });

        it('should prevent sql injections on creates rides', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    rider_name: '; --'
                })
                .expect(200, (err, res) => {
                    if (err) return done(err);

                    expect(res.body[0].riderName).to.equal('; --');
                    return done();
                });
        });

        it('should prevent sql injections (2) on creates rides', (done) => {
            request(app)
                .post('/rides')
                .send({
                    ...rideDataResource,
                    rider_name: "rider_name' OR 1=1"
                })
                .expect(200, (err, res) => {
                    if (err) return done(err);

                    expect(res.body[0].riderName).to.equal("rider_name' OR 1=1");
                    return done();
                });
        });
    });

    describe('GET /rides', () => {
        before(async () => {
            const dbasync = require('../src/daos/dbasync');
            const seedIteration = 10;
            const sql = 'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const values = ['70', '70', '50', '50', 'bo chen fadlan', 'moses lo gonzalez', 'harley davidson'];
            for (let i = 0; i < seedIteration; i++) {
                await dbasync.insertRide(db, sql, values);
            }

            return;
        });

        it('should return all rides', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200, (err, res) => {
                    if (err) return done(err);

                    expect(res.body.length).to.equal(10);
                    return done();
                });
        });

        it('should return all rides with limit 3', (done) => {
            request(app)
                .get('/rides?limit=3')
                .expect('Content-Type', /json/)
                .expect(200, (err, res) => {
                    if (err) return done(err);

                    expect(res.body.length).to.equal(3);
                    return done();
                });
        });

        it('should return all rides with limit 5 and offset 11', (done) => {
            request(app)
                .get('/rides?limit=3&offset=11')
                .expect('Content-Type', /json/)
                .expect(200, (err, res) => {
                    if (err) return done(err);

                    expect(res.body.length).to.equal(2);
                    return done();
                });
        });

        it('should return 400 bad request if query limit and offset not a number', (done) => {
            request(app)
                .get('/rides?limit=asd&offset=asd')
                .expect('Content-Type', /json/)
                .expect(400, (err, res) => {
                    if (err) return done(err);

                    expect(res.body.statusText).to.equal('Bad Request');
                    return done();
                });
        });
    });

    describe('GET /rides/:id', () => {
        it('should return ride details', (done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(200, (err, res) => {
                    if (err) return done(err);

                    expect(res.body.riderName).to.equal('bo chen fadlan');
                    return done();
                });
        });

        it('should return RIDES_NOT_FOUND_ERROR', (done) => {
            request(app)
                .get('/rides/-10')
                .expect('Content-Type', /json/)
                .expect(404, (err, res) => {
                    if (err) return done(err);

                    expect(res.body.error_code).to.equal('RIDES_NOT_FOUND_ERROR');
                    return done();
                });
        });

        it('should return 400 bad request if id is not a number', (done) => {
            request(app)
                .get('/rides/asd')
                .expect('Content-Type', /json/)
                .expect(400, (err, res) => {
                    if (err) return done(err);

                    expect(res.body.statusText).to.equal('Bad Request');
                    return done();
                });
        });
    });
});