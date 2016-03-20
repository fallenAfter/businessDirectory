var express= require('express');
var router= express.Router();
// auth packages
var passport= require('passport');
var mongoose= require('mongoose');
var User= require('../models/users');
var configDb= require('../config/db.js');
console.log('auth connected');

passport.serializeUser(function (user, done){
	done(null,user.id);
});

passport.deserializeUser(function (id, done){
	User.findById(id, function(err,user){
		done(err, user);
	});
});

router.get('/register', function (req,res,next){
	res.render('auth/register',{
		title: 'register'
	});
});

router.post('/register', function (req,res,next){
	User.register(new User({username: req.body.username}), req.body.password, function (err, account){
		console.log(err);

		if(err){
			return res.render('auth/register',{title:'register'});
		}
		else{
			res.redirect('/');
		}
	});
});

router.get('/login', function (req,res,next){
	//get session messages
	var messages= req.session.message || [];
	//clear session messages
	req.session.messages= [];

	res.render('auth/login',{
		title: 'Login',
		user: req.user,
		// messages: messages
	});
});

router.post('/login', passport.authenticate('local',{
	successRedirect: '/',
	failureRedirect: '/auth/login',
	failureMessage: 'login failed'
}));


module.exports=router, passport;