var express = require('express');
var router = express.Router();
var userModel = require('mongoose').model('User');

getKeys = function (req, res){
    var user = req.user;
    userModel.find({}, {keys:1}, function (err, result){
        if(err) throw err;
        else{
            res.status(200).send(result);
        }
    })
}


router.get('/keys', getKeys);
module.exports = router;
