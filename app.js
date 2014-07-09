var express = require("express");
var app = express();
var bodyParser = require("body-parser");


/***
	Connecting to database
***/
var mongoose = require("mongoose");
var db = mongoose.connection;
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/subject");
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
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	next();
};
app.use(allowCrossDomain);


/***
	Setting up routes
***/
app.get("/", function(req, res) {
	res.send("Hello");
});
app.get("/getword", WordController.getword);
app.post("/addword", WordController.addword);
app.post("/flagword", WordController.flagword);


/***
	Turning on Server
***/
app.listen(3000, function() {
	console.log("Listening on port 3000");
});
