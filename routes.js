var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var mongoConfig = require('./config/database.js');

var url = mongoConfig.url; //Mongodb url

router.get('/', function(req,res){
	res.render('index', {message:'Welcome to MoviePitch!', title:'Moviepitch - The movie pitching app'});
});

router.post('/insert-pitch', function(req,res){
       	item = {
		pitch: req.body.pitch,
		upvotes: parseInt(0),
		downvotes: parseInt(0)
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
	var id = req.query.id;
	var vote = req.query.vote;
	
	if(vote=="up"){
		mongo.connect(url, function(err,db){
			assert.equal(null,err);
			var o_id = new mongo.ObjectId(id);
			db.collection('pitches').update(
				{'_id':o_id},
				{$inc: {upvotes:1} },
				function(err,modRec){
					console.log('Modified '+modRec+' record.');
					res.redirect('/listPitches');
				});
		});
	}else if(vote == "down"){
		mongo.connect(url, function(err,db){
			assert.equal(null,err);
			var o_id = new mongo.ObjectId(id);
			db.collection('pitches').update(
				{'_id':o_id},
				{$inc: {downvotes:-1} },
				function(err,modRec){
					console.log('Modified '+modRec+' record.');
					res.redirect('/listPitches');
				});
		});
	}
});

router.get('/listPitches', function(req,res){
	//Connect to db and list all items
	mongo.connect(url, function(err,db){
		assert.equal(null,err);
		db.collection('pitches').aggregate(
			[	
				{ $project: {"pitch":1,"upvotes":1,"downvotes":1, "votesTotal": { $sum: ["$upvotes","$downvotes"] }} }
			]).sort({votesTotal: -1 }).toArray(function(err,docs){
			assert.equal(null,err);
			res.render('listPitches', {items: docs});
			db.close();
			console.log(docs);
		});
	});
});

module.exports = router;
