var express = require('express');
var router = express.Router();
var user = require('./user');
var key = require('./key');
var auth = require('../config/auth.js');
var server = require('./serverKeys.js');
var middleware = require('../config/middleware.js');

router.use('/key', middleware.ensureAuthenticated, key);
router.use('/user', middleware.ensureAuthenticated, user);
router.post('/register', auth.signup);
router.post('/login', auth.signin);
router.post('/commonRegister', auth.signupCommonUser);

//Blind signature
router.get('/serverKeys', server.getPublicKeys);
router.post('/serverKeys2', server.postSignKey);
router.post('/challenge1', server.postChallenge1);
router.post('/challenge2', server.postChallenge2);

module.exports = router;