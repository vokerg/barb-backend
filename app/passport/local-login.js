const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = db => new PassportLocalStrategy(
  {
    session: false,
    passReqToCallback: true
  },
  (req, username, password, done) => {
    db.collection('users').find({username, password}).toArray((err, users) => {
      if (users.length !== 1) {
        done(null, false)
      } else {
        done(null, true)
      }
    })
  }
)
