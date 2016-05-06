var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var service = require('./service');

exports.signup = function(req, res, next) {  
    var user = new User({
    	username:req.body.username,
    	password:req.body.password
    });

    user.save(function(err){
        if(err) next(err);
        else res.status(200).send({token: service.createToken(user)});
    });
};

exports.signin = function(req, res, next) {  
    User.findOne({username: req.body.username,password:req.body.password}, function(err, user) {
    	if(err) next(err);
    	if(!user) res.status(403).send("403 Unauthorization")
    	else res.status(200).send({token: service.createToken(user)});
	});
    	
};
