var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var service = require('./service');
//var userModel = mongoose.model('Email');
var userModel = require("../models/emailModel.js");

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

exports.signup = function(req, res, next) {

    console.log('signUp', req.body);

    var user = new User({
    	username:req.body.username,
    	password:req.body.password
    });

    user.save(function(err){
        if(err) next(err);
        else res.status(200).send({token: service.createToken(user)});
    });
};

exports.signupCommonUser = function (req, res){
    console.log("user", req.body);
    var newUser = new userModel ({
        "name" : req.body.name,
        "email": req.body.email
    });
    console.log(newUser);
    userModel.findOne({"email": newUser.email}, function (err, object) {
        if (err) {
            console.log(err);
        } else if (object !== null) {
            console.log("The user already exists");
        } else {
            console.log("The user doesn't exists in the database");
            newUser.save(newUser, function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("User saved in database");
                    //res.status(200).json(newUser);
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'keyboxcitie2@gmail.com',
                            pass: 'keybox123'
                        }
                    });

                    var mailOptions = {
                        from: '"keyBox" <keyboxcitie2@gmail.com>', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'keyBox registration', // Subject line
                        html: '<a href="https://localhost:3000/#/register"> This mail is for you can complete the registration with an anonymous identity </a>' // html body
                        //<a> This mail is for you can complete the registration with an anonymous identity </a>
                    };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }else{
                            res.status(200).json(newUser)
                        }
                        console.log('Message sent: ' + info.response);
                    });

                }
            })
        }
    });
};

exports.signIn = function(req, res, next) {
    User.findOne({username: req.body.username,password:req.body.password}, function(err, user) {
    	if(err) next(err);
    	if(!user) res.status(403).send("403 Unauthorization")
    	else res.status(200).send({token: service.createToken(user)});
	});
};
