var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    username: {type:String, unique : true, require: true},
    password:{type:String, require:true},
    keys:[{
        tag:{type:String, require:true},
        username:{type:String, require:true},
        password:{type:String, require:true},
        comment:{type:String}
    }]
},{timestamps: true} );

module.exports = mongoose.model('User', User);