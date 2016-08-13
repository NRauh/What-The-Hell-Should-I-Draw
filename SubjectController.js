var Subject = require("./Subject").Subject;

exports.getRandomSubject = function(cb) {
	Subject.findOneRandom((err, sub) => {
		if (err) {
			return cb({
				err: err
			});
		}

		return cb({
			sub: sub
		});
	});
};


exports.addSubject = function(body, cb) {
	var subject = body.subject;

	if (!subject) {
		return cb({
			err: "No subject"
		});
	}

	if (subject.length > 100) {
		return cb({
			err: "Subject is too long"
		});
	}

	subject = subject.toLowerCase();

	Subject.findOne({subject: subject}, (err, sub) => {
		if (err) {
			return cb({
				err: err
			});
		}

		if (sub) {
			return cb({
				err: "Subject already exists"
			});
		}

		Subject.create({subject: subject}, (err, sub) => {
			if (err) {
				return cb({
					err: err
				});
			}

			return cb({
				msg: "Subject added"
			});
		});
	});
}


exports.flagSubject = function(body, cb) {
	var flagSubject = body.subject;

	if (!flagSubject) {
		return cb({
			err: "Missing subject to flag"
		});
	}

	flagSubject = flagSubject.toLowerCase();

	Subject.findOne({subject: flagSubject}, (err, sub) => {
		if (err) {
			return cb({
				err: err
			});
		}

		if (!sub) {
			return cb({
				err: "Subject not found"
			});
		}

		if (sub.flagCount >= 22) {
			Subject.remove({
				subject: flagSubject
			}, (err) => {
				if (err) {
					return cb({
						err: err
					});
				}

				return cb({
					msg: "Subject flagged"
				});
			});

		} else {
			Subject.update({
				subject: flagSubject
			}, {
				flagCount: sub.flagCount + 1
			}, (err, sub) => {
				if (err) {
					return cb({
						err: err
					});
				}

				return cb({
					msg: "Subject flagged"
				});
			});
		}
	});
};
