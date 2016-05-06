var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var service = require('./service');

exports.signup = function(req, res, next) {  
    var Hashes = require('jshashes');
    var passwordHash = new Hashes.SHA256(req.body.password).hex(req.body.password);
    var user = new User({
    	username:req.body.username,
    	password:passwordHash
    });

    user.save(function(err){
        if(err) next(err);
        else res.status(200).send({token: service.createToken(user)});
    });
};

exports.signin = function(req, res, next) {
    var Hashes = require('jshashes');
    var passwordHash = new Hashes.SHA256(req.body.password).hex(req.body.password);
    User.findOne({username: req.body.username,password:passwordHash}, function(err, user) {
    	if(err) next(err);
    	if(!user) res.status(403).send("403 Unauthorization")
    	else res.status(200).send({token: service.createToken(user)});
	});
    	
};
