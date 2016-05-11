var express = require('express');
var router = express.Router();
var userModel = require('mongoose').model('User');
var userEmailModel = require('mongoose').model('Email');

getUsers = function (req, res){
	console.log("user", req.user);
	userModel.find({}).exec(function(err, result){
		if(err) res.send(new Error(err).status(500));
		else{
			res.status(200).send(result);
		}
	})
}

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

router.get('/', getUsers);
router.post('/registerUser', postUserEmail);

module.exports = router;
