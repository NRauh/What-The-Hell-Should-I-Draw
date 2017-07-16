const expect = require("chai").expect;
const SubjectController = require("../SubjectController");
const sinon = require("sinon");


describe("SubjectController", () => {
	var Subject;
	var controller;

	beforeEach(() => {
		Subject = {
			findOneRandom: sinon.stub(),
			findOne: sinon.stub(),
			create: sinon.stub(),
			remove: sinon.stub(),
			update: sinon.stub()
		};
		controller = new SubjectController(Subject);
	});

	describe("getRandomSubject", () => {
		it("should call findOneRandom", () => {
			controller.getRandomSubject();
			expect(Subject.findOneRandom.called).to.equal(true);
		});

		it("should callback with an error message if findOneRandom has an error", (done) => {
			controller.Subject.findOneRandom.callsFake((cb) => {
				cb("Failed to query");
			});

			controller.getRandomSubject((msg) => {
				expect(msg.err).to.equal("Failed to query");
				done();
			});
		});

		it("should callback with a subject", (done) => {
			controller.Subject.findOneRandom.callsFake((cb) => {
				cb(undefined, "A thing to draw");
			});

			controller.getRandomSubject((msg) => {
				expect(msg.err).to.equal(undefined);
				expect(msg.sub).to.equal("A thing to draw");
				done();
			});
		});
	});

	describe("addSubject", () => {
		it("requires a subject", (done) => {
			controller.addSubject({}, (msg) => {
				expect(msg.err).to.equal("No subject");
				done();
			});
		});

		it("requires subject to be no more than 100 characters", (done) => {
			controller.addSubject({
				subject: "Vestibulum pretium eleifend euismod. Praesent at velit orci. Maecenas augue quam, lobortis sit metus."
			}, (msg) => {
				expect(msg.err).to.equal("Subject is too long");
				done();
			});
		});

		it("should callback with an error if there is an error finding if it exists", (done) => {
			controller.Subject.findOne.callsFake((query, cb) => {
				cb("Failed to query");
			});

			controller.addSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal("Failed to query");
				done();
			});
		});

		it("should callback with an error if the subject already exists", (done) => {
			controller.Subject.findOne.callsFake((query, cb) => {
				cb(undefined, "Person");
			});

			controller.addSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal("Subject already exists");
				done();
			});
		});

		it("should callback with an error if there is an error creating the subject", (done) => {
			controller.Subject.findOne.callsFake((query, cb) => {
				cb(undefined, undefined);
			});
			controller.Subject.create.callsFake((params, cb) => {
				cb("Failed to create");
			});

			controller.addSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal("Failed to create");
				done();
			});
		});

		it("should create a subject if it doesn't exist", (done) => {
			controller.Subject.findOne.callsFake((query, cb) => {
				cb(undefined, undefined);
			});
			controller.Subject.create.callsFake((params, cb) => {
				cb(undefined, "person");
			});

			controller.addSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal(undefined);
				expect(msg.msg).to.equal("Added: person");
				done();
			});
		});
	});

	describe("flagSubject", () => {
		it("needs a subject to flag", (done) => {
			controller.flagSubject({}, (msg) => {
				expect(msg.err).to.equal("Missing subject to flag");
				done();
			});
		});

		it("should return an error if there is an error seeing if the subject exists", (done) => {
			controller.Subject.findOne.callsFake((query, cb) => {
				cb("Error flagging subject");
			});
			controller.flagSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal("Error flagging subject");
				done();
			});
		});

		it("says if the subject isn't found", (done) => {
			controller.Subject.findOne.callsFake((query, cb) => {
				cb(undefined, undefined);
			});
			controller.flagSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal("Subject not found");
				done();
			});
		});

		it("removes the subject on the 23 flag", (done) => {
			var givenSubject = {
				subject: "Person",
				flagCount: 23
			};
			controller.Subject.findOne.callsFake((query, cb) => {
				cb(undefined, givenSubject);
			});
			controller.Subject.remove.callsFake((query, cb) => {
				cb(undefined);
			});
			controller.flagSubject({subject: "Person"}, (msg) => {
				expect(controller.Subject.remove.called).to.equal(true);
				expect(msg.msg).to.equal("Subject flagged");
				done();
			});
		});

		it("should return an error if there is an error removing the subject", (done) => {
			var givenSubject = {
				subject: "Person",
				flagCount: 23
			};
			controller.Subject.findOne.callsFake((query, cb) => {
				cb(undefined, givenSubject);
			});
			controller.Subject.remove.callsFake((query, cb) => {
				cb("Error removing subject");
			});
			controller.flagSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal("Error removing subject");
				done();
			});
		});

		it("should return an error if there is an error updating flagCount", (done) => {
			var givenSubject = {
				subject: "Person",
				flagCount: 1
			};
			controller.Subject.findOne.callsFake((query, cb) => {
				cb(undefined, givenSubject);
			});
			controller.Subject.update.callsFake((query, params, cb) => {
				cb("Error updating subject");
			});
			controller.flagSubject({subject: "Person"}, (msg) => {
				expect(msg.err).to.equal("Error updating subject");
				done();
			});
		});

		it("increments the flag count of a subject by one", (done) => {
			var givenSubject = {
				subject: "Person",
				flagCount: 1
			};
			controller.Subject.findOne.callsFake((object, cb) => {
				cb(undefined, givenSubject);
			});
			controller.Subject.update.callsFake((query, params, cb) => {
				cb(undefined, "Person");
			});
			controller.flagSubject({subject: "Person"}, (msg) => {
				expect(msg.msg).to.equal("Subject flagged");
				done();
			});
		});
	});
});
