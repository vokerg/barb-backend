var {ObjectId} = require('mongodb');

module.exports = (app, db) => {

  app.post('/shops/:id/ratings', (req, res) => {
    const id = {_id: new ObjectId(req.params.id)};
    db.collection("shops").findOne(id, (err, shop) => {
      shop = {...shop, ratings:[...shop.ratings, {comment:"my comment", rating: "5"}]}
      db.collection("shops").update(id, shop, (err, result) => {
        res.send(shop);
      });
    });
  });

};
