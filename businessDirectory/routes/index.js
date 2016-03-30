var express = require('express');
var router = express.Router();
var monoose= require('mongoose');
var Directory= require('../models/directory');
var passport= require('passport');
console.log('index');
/* GET home page. */
router.get('/', function (req, res, next) {
	console.log(req.user);
	//query database to get all the businesses
	Directory.find(function (err, directory){
		if(err){
			console.log(err);
			res.end(err);
		}
		else{
			res.render('index', {
				title: 'Directory',
				directory: directory,
				user: req.user
			});
		}
	});
  
});


function isAuth(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/login');
	}
}

module.exports = router;
