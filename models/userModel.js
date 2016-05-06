var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    username: {type:String, unique : true, required: true},
    password:{type:String, required:true},
    keys:[{
        tag:{type:String, required:true},
        username:{type:String, required:true},
        password:{type:String, required:true},
        comment:{type:String}
    }]
},{timestamps: true} );

module.exports = mongoose.model('User', User);