const passport = require('passport');
const { getLoginResponseObject } = require('../utils')

const router = require('express').Router();
router.route('').post((req, res) =>
  passport.authenticate('local-signup',
    (err, success, user) =>
      (!err && success)
        ? res.json({ success, userId: user._id })
        : res.status(409).json({ success: "false", message: "Can't create user" })
  )(req, res)
);

module.exports = router;
