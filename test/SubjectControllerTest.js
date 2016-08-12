const expect = require("chai").expect;
const SubjectController = require("../SubjectController.js");
var mongoose = require("mongoose");
var db = mongoose.connection;
const Subject = require("../Subject.js").Subject;

before(() => {
	mongoose.connect("mongodb://localhost/subject-test");
});

describe("addSubject", () => {
	it("requires a subject", (done) => {
		SubjectController.addSubject({}, (msg) => {
			expect(msg.err).to.equal("No subject");
			done();
		});
	});

	it("requires subject to be no more than 100 characters", (done) => {
		SubjectController.addSubject({
			subject: "Vestibulum pretium eleifend euismod. Praesent at velit orci. Maecenas augue quam, lobortis sit metus."
		}, (msg) => {
			expect(msg.err).to.equal("Subject is too long");
			done();
		});
	});

	it("says it added the subject", (done) => {
		SubjectController.addSubject({subject: "Person"}, (msg) => {
			expect(msg.err).to.equal(undefined);
			expect(msg.msg).to.equal("Subject added");
			done();
		});
	});

	it("adds the subject (lowercased) to the db", (done) => {
		Subject.findOne({subject: "person"}, (err, obj) => {
			expect(obj.subject).to.equal("person");
			expect(obj.flagCount).to.equal(0);
			done();
		});
	});

	it("needs the subject to be unique", (done) => {
		SubjectController.addSubject({subject: "Person"}, (msg) => {
			expect(msg.err).to.equal("Subject already exists");
			done();
		});
	});
});

describe("getRandomSubject", () => {
	before((done) => {
		SubjectController.addSubject({subject: "Multiple people"}, (msg) => {
			done();
		});
	});

	it("gets a random entry", (done) => {
		SubjectController.getRandomSubject((msg) => {
			expect(msg.sub).to.exist;
			done();
		});
	});
});

describe("flagSubject", () => {
	it("needs a subject to flag", (done) => {
		SubjectController.flagSubject({}, (msg) => {
			expect(msg.err).to.equal("Missing subject to flag");
			done();
		});
	});

	it("says if the subject isn't found", (done) => {
		SubjectController.flagSubject({subject: "Nonexistant"}, (msg) => {
			expect(msg.err).to.equal("Subject not found");
			done();
		});
	});

	it("says it flagged the subject", (done) => {
		SubjectController.flagSubject({subject: "Person"}, (msg) => {
			expect(msg.msg).to.equal("Subject flagged");
			done();
		});
	});

	it("increments the flag count of a subject by one", (done) => {
		Subject.findOne({subject: "person"}, (err, obj) => {
			expect(obj.flagCount).to.equal(1);
			done();
		});
	});
});

after((done) => {
	Subject.remove({subject: "person"}, (err, obj) => {
		Subject.remove({subject: "multiple people"}, (err, obj) => {
			done();
		});
	});
});


