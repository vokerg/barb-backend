var {ObjectId} = require('mongodb');

module.exports = (app, db) => {

  app.get('/shops/', (req, res) => {
    let {filter, service} = req.query;
    filter = filter==='favorites' ? {'favorited':'true'} : {}
    service = (service!=='' && (service !== undefined)) ? {'services':service} : {}
    db.collection('shops').find({...filter, ...service}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.get('/shops/:id', (req, res) => {
    const id = {_id: new ObjectId(req.params.id)};
    db.collection('shops').find(id).toArray((err, shop) => {
      res.send(shop);
    });
  });

  app.post('/shops/:id', (req, res) => {
    const id = {_id: new ObjectId(req.params.id)};
    db.collection('shops').findOne(id, (err, shop) => {
      shop = {
        ...shop,
        ...req.body
      };
      db.collection('shops').update(id, shop, (err, result) => res.send(shop));
    });
  });

  app.put('/shops', (req, res) => {
    let {ratings, services} = req.body
    const shop = {
      ...req.body,
      ratings: (ratings!==undefined) ? ratings : [] ,
      services: (services !== undefined) ? services : []
    };
    db.collection('shops').insert(shop, (err, result) => {
      res.send(shop);
    });
  });

  app.delete('/shops', (req, res) => {
    db.collection('shops').deleteMany({});
    res.send("Done");
  });

};
