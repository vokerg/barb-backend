const passport = require('passport');

module.exports = (app) => {
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/error',
    session: false
  }));

  app.post('/login', (req, res, next) => {
    return passport.authenticate('local-login',
      (err, token) => {
        if (!err) {
          return res.json({
            success: "true",
            token,
          })
        }
        else {
          return res.status(400).json({
            success: "false",
          })
        }
      }
    )(req, res, next);
  }
  );
};
