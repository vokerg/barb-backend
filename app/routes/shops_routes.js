var {ObjectId} = require('mongodb');

module.exports = (app, db) => {

  app.get('/shops/', (req, res) => {
    db.collection('shops').find().toArray((err, docs) => {
      res.send(docs);
    });
  });

  module.exports = (app, db) => {
    app.get('/shops/:id', (req, res) => {
      const id = {_id: new ObjectId(req.params.id)};
      db.collection('shops').find(id).toArray((err, docs) => {
        res.send(docs);
      });
    })
  };

  app.post('/shops', (req, res) => {
    const shop = req.body;
    db.collection('shops').insert(shop, (err, result) => {
      res.send(shop);
    });
  })
};
