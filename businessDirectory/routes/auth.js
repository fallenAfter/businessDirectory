var express= require('express');
var router= express.Router();
// auth packages
var passport= require('passport');
var mongoose= require('mongoose');
var Account= require('../models/users');
var configDb= require('../config/db.js');
console.log('auth connected');

router.get('/register', function (req,res,next){
	res.render('auth/register',{
		title: 'register'
	});
});


module.exports=router, passport;