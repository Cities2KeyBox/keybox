var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Email = new Schema({
	name:{type:String, require:true},
	email:{type:String, require:true, unique : true}
});

module.exports = mongoose.model('email', Email);