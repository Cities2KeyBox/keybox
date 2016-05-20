var bignum = require('bignum');
var rsa = require('./rsa-bignum.js');

var keys = rsa.generateKeys(1024);

exports.getPublicKeys = function(req, res){
    var data = {
        n:keys.publicKey.n.toString(16),
        e:keys.publicKey.e.toString(16)
    };

    console.log('keys', data);

    res.status(200).send(data);
};

exports.postSignKey = function(req, res){
    var key = keys.publicKey.e.toString(16);
    res.status(200).send(key);
};
