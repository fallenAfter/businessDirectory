var express = require('express');
var router = express.Router();
var mongoose= require('mongoose');
var Directory= require('../models/directory');
var util= require('util');
//add multer for file uplode
var multer= require('multer');
//configure multer for cover photo
var coverStorage= multer.diskStorage({
	destination: function (req,file,callback){
		callback(null, './public/images/cover');
	},
	filename: function (req,file,callback){
		callback(null, Date.now()+'-'+file.originalname );
	}
}, function(err){
	if(err){
		console.log(err);
		res.end(err);
	}
});
var uplodeCover= multer({storage:coverStorage}).single('cover');

console.log('directory');

/* GET home page. */
router.get('/', isAuth, function(req, res, next) {
	var user= req.user._id;
	console.log(user);
	Directory.find({account: user}, function (err, directory){
		if(err){
			console.log(err);
			res.end(err);
		}
		else{
			res.render('user/index', {
				title: 'Directories',
				directory: directory,
				user: req.user
			});
		}
	})
  
});

router.get('/add', isAuth, function (req, res, next){
	res.render('user/add', {
		title: 'Add Directory',
		user: req.user
	});
});

router.get('/:id', function (req,res,next){
	//get the id from address
	var id= req.params.id;
	
	Directory.findById(id, function (err, directory){
		if(err){
			console.log(err);
			res.end(err);
		}
		else{
			res.render('./user/page',{
				title: directory.businessName,
				directory: directory,
				user: req.user
			});
		}

	});

});

router.post('/add',isAuth, function (req, res, next){

	//handle file uplode
	uplodeCover(req,res,function(err){
		if(err){
			console.log(err);
			res.end(err);
		}
		else{
			console.log('file: '+util.inspect(req.file));

			Directory.create({
				businessName: req.body.businessName,
				businessAddress: req.body.businessAddress,
				businessDescription: req.body.businessDescription,
				account: req.user._id,
				user: req.user,
				cover: req.file.filename
			});
			res.redirect('/');
		}
	});
	
});
router.get('/edit/:id', isAuth, function (req,res,next){
	var id =req.params.id;
	//find selected directory using id
	Directory.findById(id, function (err, directory){
		if(err){
			//throwe errors
			console.log(err);
			res.end(err);
		}
		else{
			//if tehre are no errors display page with form where values are set to existing
			res.render('./user/update', {
				title: "Update entry",
				directory: directory,
				user: req.user
			});
		}
	});
});

router.post('/edit/:id', isAuth, function(req,res,render){
	//get the id from url
	var id = req.params.id;
	//create updated directory object
	var directory = new Directory({
		_id: id,
		businessName: req.body.businessName,
		businessAddress: req.body.businessAddress,
		businessDescription: req.body.businessDescription,
		account: req.user._id
	})
	// update appropriate directory based upon id
	Directory.update({_id:id}, directory, function(err){
		if(err){
			console.log(err);
			res.end(err);
		}
		else{
			res.redirect('/directory/');
		}
	})
});

router.get('/delete/:id', isAuth, function (req,res,next){
	//get the id from url
	var id = req.params.id
	Directory.remove({_id:id}, function (err){
		if(err){
			console.log(err);
			res.end(err);
		}
		else{
			res.redirect('/directory/');
		}
	})
});


function isAuth(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/user/login');
	}
}

module.exports = router;