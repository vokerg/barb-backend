var {ObjectId} = require('mongodb');
const authenticate = require('../passport/authenticate');

module.exports = (app, db) => {
  app.put('/shops/:id/ratings', (req, res) =>
  {
    const {userId, shopId, author, rating, comment} = req.body;
    if (userId) {
      authenticate(req, res, () => {
        dbUserId = {
          _id: new ObjectId(userId)
        };
        db.collection("users").findOne(dbUserId, (err, user) => {
          const ratingInstance = {author: user.username, shopId, rating, comment, userId};
          addRating(db, ratingInstance, shop => res.send({newAuthor: user.username, shop}));
        });
      });
    } else {
      const ratingInstance = {author, shopId, rating, comment, userId:null};
      addRating(db, ratingInstance, shop => res.send({newAuthor: author, shop}));
    }
  });
};

addRating = (db, ratingInstance, next) => {
  const {shopId, author, comment, rating, userId} = ratingInstance;
  const id = {
    _id: new ObjectId(shopId)
  };
  db.collection("shops").findOne(id, (err, shop) => {
    shop = {
      ...shop,
      ratings:[
        ...shop.ratings,
        {author, comment, rating, userId}
      ]
    };
    db.collection("shops").update(id, shop, (err, result) => {
      next(shop);
    });
  });
}
