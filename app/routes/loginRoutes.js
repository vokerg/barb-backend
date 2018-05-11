const passport = require('passport');

const { getLoginResponseObject } = require('../utils')

const router = require('express').Router();
router.route('').post((req, res, next) =>
  passport.authenticate('local-login',
    (error, success, user) => (!error && success)
        ? res.json(getLoginResponseObject(user))
        : res.status(400).json({ success: "false", error })
  )(req, res, next)
);

module.exports = router;
