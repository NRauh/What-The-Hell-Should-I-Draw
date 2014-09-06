var Subject = require("./Subject").Subject;

exports.getword = function(req, res) {
	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function findEntry(randNum) {
		return Subject.findOne({
			entryNum: randNum
		}).exec(function(err, subject) {
			if (subject.flagCount > 10) {
				return getRandEntry();
			}
			return res.json(subject);
		});
	}

	function getRandEntry() {
		Subject.count().exec(function(err, count) {
			var randEntryNum = randomNumber(1, count);
			return findEntry(randEntryNum);
		});
	}

	return getRandEntry();
};




exports.addword = function(req, res) {
	var newWord = req.body.newWord;

	if (!newWord) {
		return res.json({
			err: "No subject"
		});
	}

	if (newWord.length > 100) {
		return res.json({
			err: "Subject too long"
		});
	}

	newWord = newWord.toLowerCase();

	Subject.findOne({
		title: newWord
	}).exec(function(err, subject) {
		if (subject) {
			return res.json({
				err: "Subject already exists"
			});
		}

		createWord(function() {
			return res.json({
				message: "Subject added"
			});
		});
	});

	function createWord(callback) {
		Subject.count(function(err, count) {
			count = count + 1;

			Subject.create({
				title: newWord,
				entryNum: count
			}, function(err, subject) {
				callback();
			});
		});
	}
};




exports.flagword = function(req, res) {
	var flagEntryNum = parseInt(req.body.flagEntryNum);
	var flagSubject = req.body.flagSubject;

	if (!flagEntryNum) {
		return res.json({
			err: "Missing subject entry number"
		});
	}

	if (!flagSubject) {
		return res.json({
			err: "Missing subject to flag"
		});
	}

	flagSubject = flagSubject.toLowerCase();

	Subject.findOne({
		entryNum: flagEntryNum
	}).exec(function(err, subject) {
		if (subject.title !== flagSubject) {
			return res.json({
				err: "Your word didn't match"
			});
		}

		Subject.update({
			title: subject.title
		}, {
			flagCount: subject.flagCount + 1
		}, function(err, subject) {
			return res.json({
				message: "Flagged subject"
			});
		});
	});
};
