class SubjectController {

  constructor(subject) {
    this.Subject = subject;
  }

  getRandomSubject(cb) {
    this.Subject.findOneRandom((err, sub) => {
      if (err) {
        return cb({
          err: err
        });
      }

      return cb({
        sub: sub
      });
    });
  }

  addSubject(body, cb) {
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

    this.Subject.findOne({
      subject: subject
    }, (err, sub) => {
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

      this.Subject.create({
        subject: subject
      }, (err, sub) => {
        if (err) {
          return cb({
            err: err
          });
        }

        return cb({
          msg: "Added: " + sub
        });
      });
    });
  }

  flagSubject(body, cb) {
    var flagSubject = body.subject;

    if (!flagSubject) {
      return cb({
        err: "Missing subject to flag"
      });
    }

    flagSubject = flagSubject.toLowerCase();

    this.Subject.findOne({
      subject: flagSubject
    }, (err, sub) => {
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
        this.Subject.remove({
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
        this.Subject.update({
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
  }
}

module.exports = SubjectController;
