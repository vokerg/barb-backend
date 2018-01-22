const PassportLocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

module.exports = db => new PassportLocalStrategy(
  {
    session: false,
    passReqToCallback: true
  },
  (req, username, password, done) => {
    db.collection('users').find({username, password}).toArray((err, users) => {
      if (users.length !== 1) {
        //done("incorrect usename or password")
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';
        return done(error);
      } else {
        const userId = users[0]._id
        const payload = {userId};
        var token = jwt.sign(payload, require('../../config').jwtSecret);
        done(null, userId, token)
      }
    })
  }
)
