var {ObjectId} = require('mongodb');

module.exports = (app, db) => {

  app.get('/shops/', (req, res) => {
    db.collection('shops').find().toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.get('/shops/:id', (req, res) => {
    const id = {_id: new ObjectId(req.params.id)};
    db.collection('shops').find(id).toArray((err, shop) => {
      res.send(shop);
    });
  });

  app.post('/shops', (req, res) => {
    const shop = {...req.body, ratings:[]};
    db.collection('shops').insert(shop, (err, result) => {
      res.send(shop);
    });
  });

  app.delete('/shops', (req, res) => {
    db.collection('shops').deleteMany({});
    res.send("Done");
  });
  
};
