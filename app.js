var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var assert = require('assert');

var app = express();

var hbs = exphbs.create({
	defaultLayout: 'main',
	helpers:{
		link: function(text,id,vote){
			var string = "<a href='/voting?id="+ id +"&vote="+ vote + "'>"+ text +"</a>";
		}
	}
});


app.use(bodyParser());
app.use( bodyParser.json()  );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(require('./routes.js')); //Import the routes in routes.js

//Set handlebars as te default engine
app.engine('handlebars', hbs.engine );
app.set('view engine', 'handlebars');

app.listen(3000, function(){
	console.log('App running in port 3000');
});
