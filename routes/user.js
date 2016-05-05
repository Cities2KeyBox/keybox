var express = require('express');
var router = express.Router();
var userModel = require('mongoose').model('User');

getUsers = function (req, res){
	console.log("user", req.user);
	userModel.find({}).exec(function(err, result){
		if(err) res.send(new Error(err).status(500));
		else{
			res.status(200).send(result);
		}
	})
}


router.get('/', getUsers);

module.exports = router;
