'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
    start_lat: Joi.number().required(),
    start_long: Joi.number().required(),
    end_lat: Joi.number().required(),
    end_long: Joi.number().required(),
    rider_name: Joi.string().required(),
    driver_name: Joi.string().optional(),
    driver_vehicle: Joi.string().required()
}).required();