const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const SubjectController = require("./SubjectController");
var db = mongoose.connection;
var app = express();


/***
	Connecting to database
***/
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/subject");
db.on("error", console.error.bind(console, "Error:"));
db.once("open", () => {
	console.log("Connected");
});


/***
	Adding body-parser middleware
***/
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/***
	Setting up routes
***/
app.get("/", (req, res) => {
	res.send("Hello");
});

app.get("/api/getsubject", (req, res) => {
	SubjectController.getRandomSubject((msg) => {
			return res.json(msg);
	});
});

app.post("/api/addsubject", (req, res) => {
	SubjectController.addSubject(req.body, (msg) => {
		return res.json(msg);
	});
});

app.post("/api/flagsubject", (req, res) => {
	SubjectController.flagSubject(req.body, (msg) => {
		return res.json(msg);
	});
});


/***
	Turning on Server
***/
app.listen(process.env.PORT || 3000, function() {
	console.log("Listening");
});
