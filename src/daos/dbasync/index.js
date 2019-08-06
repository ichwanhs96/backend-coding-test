'use strict';

const insertRide = (db, sql, values) => new Promise((resolve, reject) => {
    db.run(sql, values, function (err) {
        if (err) {
            reject(err);
        }

        db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
});

const getRide = (db, sql, values) => new Promise((resolve, reject) => {
    db.all(sql, values, function (err, rows) {
        if (err) {
            reject(err);
        }

        resolve(rows);
    });   
});

module.exports = {
    insertRide,
    getRide
};