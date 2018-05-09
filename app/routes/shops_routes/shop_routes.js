var {ObjectId} = require('mongodb');

const authenticate = require('../../passport/authenticate');

module.exports = db => {
  const router = require('express').Router();

  router.route('')
    .get((req, res) => db.collection('shops').find({_id: new ObjectId(req.shopId)}).toArray((err, shop) => res.send(shop)))

    .post((req, res) =>
      authenticate(req, res, () =>
        db.collection('shops').findOne({_id: new ObjectId(req.shopId)}, (err, shop) => {
          shop = {
            ...shop,
            ...req.body
          };
          db.collection('shops').update({_id: new ObjectId(req.shopId)}, shop, (err, result) => res.send(shop));
        })
      )
    );

  router.use('/ratings', require('./ratings_routes')(db));

  return router;
}
