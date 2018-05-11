const authenticate = require('../../passport/authenticate');
const { getSafeUser } = require('../../utils');

module.exports = db => {
  const router = require('express').Router();

  router.route('')
    .get((req, res) => db.collection('users').findOne(req.dbUserId, (err, user) => res.send(getSafeUser(user))));

  router.use('/favorites', require('./favoriteRoutes')(db));

  router.route('/votedRatings')
    .get((req, res) => db.collection('users').findOne(req.dbUserId, (err, user) => res.send(user.voted || [])));

  router.route('/ratingsWritten')
    .get((req, res) => db.collection('users').findOne(req.dbUserId, (err, user) => res.send(user.ratingsWritten || [])));

  return router;
}
