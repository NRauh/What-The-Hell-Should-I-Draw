var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var WordController = require("./WordController");

app.use(bodyParser.urlencoded());

app.get("/getword", WordController.getword);
app.post("/addword", WordController.addword);
app.post("/flagword", WordController.flagword);

app.listen(3000, function() {
	console.log("Listening on port 3000");
});
