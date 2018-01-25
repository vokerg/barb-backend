var bcrypt = require('bcrypt')
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = db => new PassportLocalStrategy(
  {
    session: false,
    passReqToCallback: true
  },
  (req, username, password, done) =>
  {
    bcrypt.genSalt(10, (err, salt) =>
    {
      bcrypt.hash(password, salt, (err, hash) =>
        db.collection('users').insert({username, "password": hash}, (err, result) => {
          done(null, true, result.ops[0])
        }
        )
      )
    }
    )
  }
);
