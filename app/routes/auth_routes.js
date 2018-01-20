const passport = require('passport');

module.exports = (app) => {
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/error',
    session: false
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/error',
    session: false
  }));
};
