var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var assert = require('assert');

var app = express();

var url = 'mongodb://localhost:27017/MoviePitch'; //Mongodb url

app.use(bodyParser());
app.use( bodyParser.json()  );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//In the current form the app returns 'missing helper' at rendering listPitches. Maybe this didn't work.
//The helper must be registered at the rendering.
var hbs = exphbs.create({
	helpers: {
		link: function(text,id){
		       	text = exphbs.escapeExpression(text);
			id = exphbs.escapeExpression(id);

			return new exphbs.SafeString(
				"<a href='/voting?id=" + id + "&vote=up'>" + text + "</a>"
			);

		}
	}
});

//Set handlebars as te default engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get('/', function(req,res){
	res.render('index', {message:'Welcome to MoviePitch!', title:'Moviepitch - The movie pitching app'});
});

app.post('/insert-pitch', function(req,res){
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

app.get('/voting', function(req,res){
	console.log(req.query.vote);
	console.log(req.query.id);
	res.redirect('/listPitches');

});

app.get('/listPitches', function(req,res){
	var resultArray = [];
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


app.listen(3000, function(){
	console.log('App running in port 3000');
});
