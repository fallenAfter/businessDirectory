var mongoose= require('mongoose');
var schema = mongoose.Schema;


var Directory= new schema({
	businessName: String,
	businessAddress: String,
	businessDescription: String,
	account: String
});

module.exports= mongoose.model('Directory', Directory);