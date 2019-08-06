'use strict';

const express = require('express');
const router = express.Router();
const expressValidation = require('express-validation');
const Joi = require('joi');

const rideValidationMiddleware = require('../middlewares/ride_validation');

const ridesDAO = require('../daos/rides');
const rideResource = require('../resources/ride');

module.exports = (db) => {
    router.post('/rides', expressValidation(rideResource), rideValidationMiddleware, async (req, res) => {
        let createdRide;

        try {
            createdRide = await ridesDAO.createRides(db, req.body);
        } catch (e) {
            res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }

        res.send(createdRide);
    });
    
    router.get('/rides', expressValidation({
        query: {
            limit: Joi.number().default(10).optional(),
            offset: Joi.number().default(0).optional()
        }
    }), async (req, res) => {
        let rides;

        try {
            rides = await ridesDAO.getRides(db, req.query.limit, req.query.offset);
        } catch (e) {
            res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }

        res.send(rides);
    });
    
    router.get('/rides/:id', expressValidation({
        params: {
            id: Joi.number().required()
        }
    }), async (req, res) => {
        let rides;

        try {
            rides = await ridesDAO.getRideById(db, req.params.id);
        } catch (e) {
            res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }

        if (rides.length < 1) {
            return res.status(404).send({
                error_code: 'RIDES_NOT_FOUND_ERROR',
                message: 'Could not find any rides'
            });
        }

        res.send(rides[0]);
    });

    return router;
}