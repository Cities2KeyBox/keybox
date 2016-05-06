var express = require('express');
var router = express.Router();
var userModel = require('mongoose').model('User');

getKeys = function (req, res, next){
	userModel.findOne({_id:req.user}, {keys:1}, function (err, result){
		if(err) next(err);
		else{
			if(result.length) res.status(200).send(result);
			else res.status(204).send();
		}
	})
}

getKey = function (req, res, next){
	userModel.findOne({
		_id:req.user,
		keys:{
			_id:{$elemMatch:req.params.id}
		}
	}, function (err, result){
		if(err) next(err);
		else{
			if(result.length) res.status(200).send(result);
			else res.status(204).send();
		}
	})
}

createKey = function (req, res, next){
	if(req.body.tag == undefined || req.body.user == undefined || req.body.pass == undefined) res.status(400).send("400 Bad Request");
	else{
		userModel.findOne({_id:req.user}, function (err, user){
			if(err) next(err);
			else{
				user.keys.push({
					tag:req.body.tag,
					user:req.body.user,
					pass:req.body.pass,
					comment:req.body.comment || null
				});
				user.save(function (err, result){
					if(err) next(err);
					else res.status(201).send(result);
				})
			}
		})
	}
}

updateKey = function (req, res, next){
	if(req.body.tag == undefined || req.body.user == undefined || req.body.pass == undefined) req.status(400).send("400 Bad Request");
	else{
		userModel.findOne({_id:req.user,key:{_id:{$elemMatch:req.params.id}}}, function (err, result){
			if(err) next(err);
			else{
				res.status(200).send();
			}
		})
	}
}


router.get('/', getKeys);
router.get('/:id', getKey);
router.post('/', createKey);
router.put('/:id', updateKey);

module.exports = router;