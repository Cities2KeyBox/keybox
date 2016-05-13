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

exports.signupCommonUser = function (req, res){
    console.log("user", req.body);
    var user = {
        "name" : req.body.name,
        "email": req.body.email
    };
    console.log(user);
    userModel.findOne({"email": user.email}, function (err, object) {
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

exports.signin = function(req, res, next) {
    var Hashes = require('jshashes');
    var passwordHash = new Hashes.SHA256(req.body.password).hex(req.body.password);
    User.findOne({username: req.body.username,password:passwordHash}, function(err, user) {
    	if(err) next(err);
    	if(!user) res.status(403).send("403 Unauthorization")
    	else res.status(200).send({token: service.createToken(user)});
	});
    	
};
