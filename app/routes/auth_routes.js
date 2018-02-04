const passport = require('passport');
const { getLoginResponseObject } = require('../utils')

module.exports = (app) => {
  app.post('/signup', (req, res) => {
      return passport.authenticate('local-signup',
        (err, success, user) => {
          if (!err && success) {
            return res.json({
              success,
              userId: user._id
            })
          }
          else {
            return res.status(409).json({
              success: "false",
              message: "Can't create user"
            })
          }
        }
      )(req, res);
  });

  app.post('/login', (req, res, next) => {
    return passport.authenticate('local-login',
      (error, success, user) => {
        if (!error && success) {
          //const {userId, token} = user
          return res.json(getLoginResponseObject(user));
        }
        else {
          return res.status(400).json({
            success: "false",
            error
          })
        }
      }
    )(req, res, next);
  }
  );
};
