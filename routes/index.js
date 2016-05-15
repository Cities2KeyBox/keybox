var express = require('express');
var router = express.Router();
var user = require('./user');
var key = require('./key');
var auth = require('../config/auth.js');
var middleware = require('../config/middleware.js');

postUserEmail = function (req, res){
	console.log("user", req.body);
	var user = {
		"name" : req.body.name,
		"email": req.body.email
	};
	console.log(user);
	userEmailModel.findOne({"email": user.email}, function (err, object) {
		if (err) {
			console.log(err);
		} else if (object !== null) {
			console.log("The user already exists");
		} else {
			console.log("The user doesn't exists in the database");
			user.save(user, function (error) {
				if (error) {
					console.log(error);
				} else {
					console.log("User saved in database");
				}
			})
		}
	});
};

router.use('/key', middleware.ensureAuthenticated, key);
router.use('/user', middleware.ensureAuthenticated, user);
router.post('/register', auth.signup);
router.post('/registerUser', postUserEmail)
router.post('/login', auth.signin);
router.post('/commonRegister', auth.signupCommonUser);

module.exports = router;