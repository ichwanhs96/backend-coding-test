const express = require('express');
const router = express.Router();

module.exports = () => {
    router.get('/health', function (req, res) {
        res.send('Healthy');
    });

    return router;
}