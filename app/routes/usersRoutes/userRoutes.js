const authenticate = require('../../passport/authenticate');
const { getSafeUser } = require('../../utils');
const { getAggregateBookings } = require("../../utils");

module.exports = db => {
  const router = require('express').Router();

  router.route('')
    .get((req, res) => db.collection('users').findOne(req.dbUserId, (err, user) => res.send(getSafeUser(user))));

  router.use('/favorites', require('./favoriteRoutes')(db));

  router.route('/votedRatings')
    .get((req, res) => db.collection('users').findOne(req.dbUserId, (err, user) => res.send(user.voted || [])));

  router.route('/ratingsWritten')
    .get((req, res) => db.collection('users').findOne(req.dbUserId, (err, user) => res.send(user.ratingsWritten || [])));

  router.route('/bookings')
    .get((req, res) => authenticate(req, res, () => {
      const {status, time} = req.query;
        db.collection("bookings")
          .aggregate(getAggregateBookings(null, req.requestUserId, status, time))
          .toArray((err, bookings) => res.send(bookings))
    }));

  return router;
}
