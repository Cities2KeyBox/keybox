var mongoose = require('moongose');

module.exports = mongoose.model('User', {
    username: {type:String, unique : true, require: true},
    password:{type:String, require:true},
    keys:[{
        tag:{type:String, require:true},
        user:{type:String, require:true},
        pass:{type:String, require:true},
        comment:{type:String}
    }]
});