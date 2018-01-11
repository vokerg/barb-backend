var {ObjectId} = require('mongodb');

module.exports = (app, db) => {

  app.put('/shops/:id/ratings', (req, res) => {
    const id = {
      _id: new ObjectId(req.params.id)
    };
    const {shopId, author, rating, comment} = req.body;
    db.collection("shops").findOne(id, (err, shop) => {
      shop = {
        ...shop,
        ratings:[
          ...shop.ratings,
          {
            author,
            comment,
            rating
          }
        ]
      };
      db.collection("shops").update(id, shop, (err, result) => {
        res.send(shop);
      });
    });
  });
};
