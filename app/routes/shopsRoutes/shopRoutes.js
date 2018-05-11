const authenticate = require('../../passport/authenticate');

module.exports = db => {
  const router = require('express').Router();

  router.route('')
    .get((req, res) => db.collection('shops').find(req.dbShopId).toArray((err, shop) => res.send(shop)))

    .post((req, res) => authenticate(req, res, () =>
        db.collection('shops').findOne(req.dbShopId, (err, shop) => {
          shop = {
            ...shop,
            ...req.body
          };
          db.collection('shops').update(req.dbShopId, shop, (err, result) => res.send(shop));
        })
    ));

  router.use('/ratings', require('./ratingsRoutes')(db));

  router.use('/bookings', require('./bookingRoutes')(db));

  return router;
}
