var {ObjectId} = require('mongodb');

const authenticate = require('../../passport/authenticate');

const router = require('express').Router();

module.exports = db => {
  router.route('')
    .get((req, res) => {
      let {filter, service} = req.query;
      service = (service!=='' && (service !== undefined)) ? {'services':service} : {};

      const findShops = filter => db.collection('shops')
                .find({...filter, ...service})
                .toArray((err, docs) => res.send(docs));
      const {userId} = req;
      if (filter === 'favorites' && userId) {
        db.collection('users').findOne(({_id: new ObjectId(userId)}), (err, user) => {
          if (user.favorites) {
            const favoriteShopIds = user.favorites.map(id=>(new ObjectId(id)));
            findShops({_id: { $in: [...favoriteShopIds]}});
          }
        })
      } else {
        return findShops();
      }
    })

    .put((req, res) =>
      authenticate(req, res, () => {
        let {services} = req.body
        const shop = {
          ...req.body,
          services: (services !== undefined) ? services : []
        };
        db.collection('shops').insert(shop, (err, result) => res.send(shop));
      })
    );

  router.use('/:id', (req, res, next) => {
    req.shopId = req.params.id;
    req.dbShopId = {_id: new ObjectId(req.params.id)};
    next();
  }, require('./shopRoutes')(db));

  return router;
};
