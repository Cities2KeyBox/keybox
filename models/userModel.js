var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    username: {type:String, unique : true, require: true},
    password:{type:String, require:true},
    keys:[{
        tag:{type:String, require:true},
        user:{type:String, require:true},
        pass:{type:String, require:true},
        comment:{type:String}
    }]
});

module.exports = mongoose.model('User', User);