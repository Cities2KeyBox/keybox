var bignum = require('bignum');
var rsa = require('./rsa-bignum.js');

var keys = rsa.generateKeys(1024);

exports.getPublicKeys = function(req, res){
    var data = {
        n:keys.publicKey.n.toString(),
        e:keys.publicKey.e.toString()
    };

    console.log('keys', data);

    res.status(200).send(data);
};

exports.postSignKey = function(req,res){
    console.log('blindtext', req.body);
    var nUser = req.body.n;
    var eUser = keys.publicKey.e;
};
