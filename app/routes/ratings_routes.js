var {ObjectId} = require('mongodb');
const authenticate = require('../passport/authenticate');


module.exports = (app, db) => {
  app.put('/shops/:id/ratings', (req, res) =>
  {
    authenticate(req, res, () => {
      const {userId, shopId, author, rating, comment} = req.body;
      if (userId !== null) {
        const userId = {
          _id: new ObjectId(userId)
        };
        db.collection("users").findOne(userId, (err, user) => {
          const ratingInstance = {author: user.username, shopId, rating, comment};
          addRating(db, ratingInstance, dbRatingInstance => res.send(dbRatingInstance));
        })
      } else {
        const ratingInstance = {author, shopId, rating, comment};
        addRating(db, ratingInstance, dbRatingInstance => res.send(dbRatingInstance));
      }
    });
  });
};

addRating(db, ratingInstance, next) => {
  const {shopId, author, comment, rating} = ratingInstance;
  const id = {
    _id: new ObjectId(req.params.id)
  };
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
}
