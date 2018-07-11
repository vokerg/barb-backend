const authenticate = require('../../passport/authenticate');
const { getSafeUser } = require('../../utils');
const { handleDbUser } = require("../../dbUtils");

module.exports = db => {
  const router = require('express').Router();

  const handleDbUserForUserRoutes = handleDbUser(db);
  const handleDbUserAuthenticated = (req, res, handle) => authenticate(req, res, () => handleDbUserForUserRoutes(req.dbUserId)(handle))

  router.route('')
    .get((req, res) => handleDbUserAuthenticated(req, res, user => res.send(getSafeUser(user))));

  router.route('/votedRatings')
    .get((req, res) => handleDbUserAuthenticated(req, res, user => res.send(user.voted || [])));

  router.route('/ratingsWritten')
    .get((req, res) => handleDbUserAuthenticated(req, res, user => res.send(user.ratingsWritten || [])));

  router.use('/favorites', require('./favoriteRoutes')(db));
  router.use('/bookings', require('../bookingRoutes')(db));

  return router;
}
