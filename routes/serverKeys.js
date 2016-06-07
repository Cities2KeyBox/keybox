var bignum = require('bignum');
var rsa = require('./rsa-bignum.js');

var keys = rsa.generateKeys(1024);
var nonce;
var userPublicKey;

exports.getPublicKeys = function(req, res){
    var data = {
        n:keys.publicKey.n.toString(16),
        e:keys.publicKey.e.toString(16)
    };

    console.log('keys', data);

    res.status(200).send(data);
};

exports.postSignKey = function(req, res){
    var blindtext = bignum(req.body.text, 16);
    var signtextBig = keys.privateKey.encrypt(blindtext);

    var data = {
        signtext : signtextBig.toString(16)
    };

    console.log(data);

    res.status(200).send(data);
};

exports.postChallenge1 = function (req, res){
    console.log(req.body.info);
    var signPublicKey = bignum(req.body.info, 16);
    userPublicKey = keys.publicKey.decrypt(signPublicKey);

    console.log('publicKey', userPublicKey.toString(16));

    var nonceBig = bignum.rand(userPublicKey);

    nonce = nonceBig.toString(16);

    console.log('this is the nonce', nonce);

    res.status(200).send(nonce);

};

exports.postChallenge2 = function (req, res){
    console.log(req.body.signNonce);
    var signPublicKey = bignum(req.body.signNonce, 16);

    var nonceProveBig = signPublicKey.powm(keys.publicKey.e, userPublicKey);

    var nonceProve = nonceProveBig.toString(16);

    console.log('comprobacion nonce', nonceProve);

    if (nonceProve == nonce){
        res.status(200).send(nonceProve);
    }else {
        res.status(401).send(nonceProve);
    }
};