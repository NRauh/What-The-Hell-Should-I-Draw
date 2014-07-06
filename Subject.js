var mongoose = require("mongoose");

var subjectSchema = mongoose.Schema({
	title: String,
	flagCount: {
		type: Number,
		default: 0
	},
	entryNum: Number
});

var Subject = mongoose.model("Subject", subjectSchema);

exports.Subject = Subject;