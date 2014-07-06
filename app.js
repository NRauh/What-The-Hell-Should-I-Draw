var express = require("express");
var app = express();
var bodyParser = require("body-parser");


/***
	Connecting to database
***/
var mongoose = require("mongoose");
var db = mongoose.connection;
mongoose.connect("mongodb://localhost/subject");
db.on("error", console.error.bind(console, "Error:"));
db.once("open", function() {
	console.log("Connected");
});


/***
	Including controller
***/
var WordController = require("./WordController");


/***
	Adding body-parser middleware
***/
app.use(bodyParser.urlencoded());


/***
	Setting up routes
***/
app.get("/getword", WordController.getword);
app.post("/addword", WordController.addword);
app.post("/flagword", WordController.flagword);


/***
	Turning on Server
***/
app.listen(3000, function() {
	console.log("Listening on port 3000");
});
