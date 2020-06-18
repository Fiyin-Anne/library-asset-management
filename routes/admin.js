const router = require('express').Router(); //same as express.Router()
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
const Admin = require('../models/role');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Admin page.'
    });
});

module.exports = router;