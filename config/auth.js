var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var service = require('./service');

exports.signup = function(req, res) {  
    var user = new User({
    	username:req.body.username,
    	password:req.body.password
    });

    user.save(function(err){
        return res
            .status(200)
            .send({token: service.createToken(user)});
    });
};

exports.signin = function(req, res) {  
    User.findOne({username: req.body.username,password:req.body.password}, function(err, user) {
        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseña es correcta
        return res
            .status(200)
            .send({token: service.createToken(user)});
    });
};
