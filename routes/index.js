var express = require('express');
var router = express.Router();
var user = require('./user');
var key = require('./key');
var auth = require('../config/auth.js');
var middleware = require('../config/middleware.js');

router.use('/key', middleware.ensureAuthenticated, key);
router.use('/user', middleware.ensureAuthenticated, user);
router.post('/register', auth.signup);
router.post('/login', auth.signin);

module.exports = router;