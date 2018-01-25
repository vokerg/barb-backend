const PassportLocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = db => new PassportLocalStrategy(
  {
    session: false,
    passReqToCallback: true
  },
  (req, username, password, done) => {
    return db.collection('users').find({username}).toArray((err, users) => {
      if (users.length !== 1) {
        return done("Incorrect username");
      } else {
        bcrypt.compare(password, users[0].password, (err, res) => {
          if (err) {
            return done(err, false)
          }
          if (res) {
            const userId = users[0]._id
            const payload = {userId};
            var token = jwt.sign(payload, require('../../config').jwtSecret);
            done(null, true, {userId, token})
          }
          else {
            return done("Incorrect password")
          }
        })
      }
    })
  }
)
