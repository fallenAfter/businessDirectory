//add package requierments
var mongoose= require('mongoose');
var schema = mongoose.Schema;
var passportLocalMongoose= require('passport-local-mongoose');

var User= new schema({
	username: String,
	password: String
});

User.plugin(passportLocalMongoose);
//make public
module.exports= mongoose.model('User', User);