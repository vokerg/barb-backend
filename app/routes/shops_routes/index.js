var {ObjectId} = require('mongodb');

const authenticate = require('../../passport/authenticate');

const router = require('express').Router();

module.exports = db => {
  router.route('')
    .get((req, res) => {
      let {filter, service} = req.query;
      filter = filter==='favorites' ? {'favorited':'true'} : {};
      service = (service!=='' && (service !== undefined)) ? {'services':service} : {};
      db.collection('shops')
        .find({...filter, ...service})
        .toArray((err, docs) => res.send(docs));
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
    next();
  }, require('./shop_routes')(db));

  return router;
};
