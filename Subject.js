var mongoose = require("mongoose");
var random = require("mongoose-simple-random");

var subjectSchema = mongoose.Schema({
	subject: String,
	flagCount: {
		type: Number,
		default: 0
	},
});

subjectSchema.plugin(random);

var Subject = mongoose.model("Subject", subjectSchema);

exports.Subject = Subject;
