var {ObjectId} = require('mongodb');
const authenticate = require('../passport/authenticate');

module.exports = (app, db) => {
  app.put('/shops/:id/ratings', (req, res) =>
  {
    const {userId, shopId, author, rating, comment, date} = req.body;
    console.log(req.body);
    if (userId) {
      authenticate(req, res, () => {
        dbUserId = {
          _id: new ObjectId(userId)
        };
        db.collection("users").findOne(dbUserId, (err, user) => {
          const ratingInstance = {author: user.username, shopId, rating, comment, userId, date};
          addRating(db, ratingInstance, shop => res.send({newAuthor: user.username, shop}));
        });
      });
    } else {
      const ratingInstance = {author, shopId, rating, comment, userId:null, date};
      addRating(db, ratingInstance, shop => res.send({newAuthor: author, shop}));
    }
  });

  app.get('/users/:id/ratings', (req, res) => {
    const {id} = req.params;
    db.collection("shops")
      .find({'ratings.userId': id})
      .toArray((err, shops) => {
        res.send(
          shops.reduce((array, shop) =>
            array.concat(shop.ratings
              .filter(rating => rating.userId === id)
              .map(rating => ({shopId: shop.id, ...rating})))
          , [])
        || []);
      });
  });
};

addRating = (db, ratingInstance, next) => {
  const {shopId, author, comment, rating, userId, date} = ratingInstance;
  const id = {
    _id: new ObjectId(shopId)
  };
  db.collection("shops").findOne(id, (err, shop) => {
    shop = {
      ...shop,
      ratings:[
        ...shop.ratings,
        {author, comment, rating, userId, date}
      ]
    };
    db.collection("shops").update(id, shop, (err, result) => {
      next(shop);
    });
  });
}
