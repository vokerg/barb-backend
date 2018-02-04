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
            //const userId = users[0]._id
            //const token = getJwtToken(userId);
            done(null, true, users[0])
          }
          else {
            return done("Incorrect password")
          }
        })
      }
    })
  }
)
