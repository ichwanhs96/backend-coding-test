'use strict';

const dbasync = require('./dbasync');
const assert = require('assert-plus');

// need to make sure sql injections are handled correctly

async function createRides(db, rideData) {
    const values = [rideData.start_lat, rideData.start_long, rideData.end_lat, rideData.end_long, rideData.rider_name, rideData.driver_name, rideData.driver_vehicle];
    const sql = 'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)';
                
    const result = await dbasync.insertRide(db, sql, values);

    return result;
}

async function getRides(db, limit = 10, offset = 0) {
    assert.object(db);
    assert.number(limit);
    assert.number(offset);

    const sql = 'SELECT * FROM Rides LIMIT ? OFFSET ?'
    const values = [limit, offset];

    return await dbasync.getRide(db, sql, values);
}

async function getRideById (db, id) {
    assert.object(db);
    assert.number(id);

    const sql = 'SELECT * FROM Rides WHERE rideID = ?';
    const values = [id];

    return await dbasync.getRide(db, sql, values);
}

module.exports = {
    createRides,
    getRides,
    getRideById
};