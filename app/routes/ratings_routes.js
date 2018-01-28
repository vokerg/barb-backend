var {ObjectId} = require('mongodb');
const authenticate = require('../passport/authenticate');


module.exports = (app, db) => {
  app.put('/shops/:id/ratings', (req, res) =>
  {
    authenticate(req, res, () => {
      const id = {
        _id: new ObjectId(req.params.id)
      };
      const {shopId, author, rating, comment} = req.body;
      db.collection("shops").findOne(id, (err, shop) => {
        shop = {
          ...shop,
          ratings:[
            ...shop.ratings,
            {author, comment, rating}
          ]
        };
        db.collection("shops").update(id, shop, (err, result) => {
          res.send(shop);
        });
      });
    })
  });
};
