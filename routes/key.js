var express = require('express');
var router = express.Router();
var userModel = require('mongoose').model('User');

getKeys = function (req, res, next){
	userModel.findOne({_id:req.user}, {keys:1}, function (err, result){
		if(err) next(err);
		else{
			if(result) {
				if(result.keys.length) res.status(200).send(result['keys']);
				else res.status(204).send();
			}
			else res.status(403).send("403 Unathorization");
		}
	})
}

getKey = function (req, res, next){
	userModel.findOne({_id:req.user,"keys._id":req.params.id})
	.exec(function (err, result){
		if(err) next(err);
		else{
			if(result){
				var match = false
				var index = 0;
				for (i=0; (i<result.keys.length && !match);i++){
					if(result.keys[i]['_id'] == req.params.id){
						match = true;
						index = i;
					}
				}
				if(match) res.status(200).send(result.keys[i]);
				else res.send(204).send();
			} else{
				res.status(404).send("404 Not Found");
			}
		}
	})
}

createKey = function (req, res, next){
	console.log(req);
	if(req.body.tag == undefined || req.body.username == undefined || req.body.password == undefined) res.status(400).send("400 Bad Request");
	else{
		userModel.findOne({_id:req.user}, function (err, user){
			if(err) next(err);
			else{
				if(user){				
					user.keys.push({
						tag:req.body.tag,
						username:req.body.username,
						password:req.body.password,
						comment:req.body.comment || null
					});
					user.save(user, function (err, result){
						if(err) next(err);
						else res.status(201).send("Created!");
					})
				} else{
					res.status(403).send("403 Unathorization");
				}
			}
		})
	}
}

updateKey = function (req, res, next){
	if(req.body.tag == undefined || req.body.username == undefined || req.body.password == undefined) req.status(400).send("400 Bad Request");
	else{
		userModel.findOne({_id:req.user,"keys._id":req.params.id}).exec(function (err, result){
			if(err) next(err);
			else{
				if(result){
					var match = false
					var index = 0;
					for (i=0; (i<result.keys.length && !match);i++){
						if(result.keys[i]['_id'] == req.params.id){
							match = true;
							index = i;
						}
					}
					if(match){
						result.keys[index] = {
							tag:req.body.tag,
							username:req.body.user,
							password:req.body.pass,
							comment:req.body.comment || undefined
						}
						result.save(function (err){
							if(err) next(err);
							else{
								res.status(201).send("Updated!");
							}
						})
					} else res.send(204).send();
				} else res.status(404).send("404 Not Found");
			}
		})
	}
}

deleteKey = function (req, res){
	userModel.findOne({_id:req.user, "keys._id":req.params.id}).exec(function (err, result){
		if(err) next(err);
		else{
			if(result){
				var match = false
				var index = 0;
				for (i=0; (i<result.keys.length && !match);i++){
					if(result.keys[i]['_id'] == req.params.id){
						match = true;
						index = i;
					}
				}
				if(match){
					result.keys.splice(index, 1);
					result.save(function (err){
						if(err) next(err);
						else res.status(201).send("Delete!");
					});
				}
			} else res.status(404).send("404 Not Found");
		}
	})
}


router.get('/', getKeys);
router.get('/:id', getKey);
router.post('/', createKey);
router.put('/:id', updateKey);
router.delete('/:id', deleteKey);
module.exports = router;