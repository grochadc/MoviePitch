var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/MoviePitch'; //Mongodb url

router.get('/', function(req,res){
	res.render('index', {message:'Welcome to MoviePitch!', title:'Moviepitch - The movie pitching app'});
});

router.post('/insert-pitch', function(req,res){
       	item = {
		pitch: req.body.pitch,
		upvotes: parseInt(req.body.upvote),
		downvotes: parseInt(req.body.downvote)
	};

	//Connect to db and instert item
	mongo.connect(url, function(err, db){
		assert.equal(null,err);
		db.collection('pitches').insertOne(item,  function(err, result){
			assert.equal(null, err);
			console.log('Item inserted', item);
			db.close();
			
		});
	res.redirect('/listPitches');
	});
});

router.get('/voting', function(req,res){
	console.log(req.query.vote);
	console.log(req.query.id);
	res.redirect('/listPitches');

});

router.get('/listPitches', function(req,res){
	//Connect to db and list all items
	mongo.connect(url, function(err,db){
		assert.equal(null,err);
		db.collection('pitches').find().sort({upvotes: -1 }).toArray(function(err,docs){
			assert.equal(null,err);
			res.render('listPitches', {items: docs});
			db.close();
			console.log(docs);
		});
	});
});

module.exports = router;
