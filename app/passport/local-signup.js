const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = db => new PassportLocalStrategy(
  {
    session: false,
    passReqToCallback: true
  },
  (req, username, password, done) => {
    db.collection('users').insert({username, password});
    return done(null, true);
  }
);
