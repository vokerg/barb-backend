var {ObjectId} = require('mongodb');
const authenticate = require('../passport/authenticate');

module.exports = (app, db) => {
  app.put('/shops/:id/ratings', (req, res) =>
  {
    let rating = req.body
    if (rating.userId) {
      authenticate(req, res, () => {
        dbUserId = {
          _id: new ObjectId(rating.userId)
        };
        db.collection("users").findOne(dbUserId, (err, user) => {
          rating = {...rating, author: user.username}
          db.collection('ratings').insert(rating, (err, result) => {
            res.send(rating);
          });
        });
      });
    } else {
      db.collection('ratings').insert(rating, (err, result) => {
        res.send(rating);
      });
    }
  });

  app.get('/shops/:id/ratings', (req, res) => {
    db.collection("ratings")
      .find({shopId:req.params.id})
      .toArray((err, ratings) => res.send(ratings));
  });

  app.post('/shops/:shopId/ratings/:id/score', (req, res) => {
    authenticate(req, res, () => {
      const {direction} = req.query;
      const ratingId = req.params.id;
      const id = {_id: new ObjectId(ratingId)};
      db.collection('ratings').findOne(id, (err, rating) => {
        rating = {...rating, score: (Number(rating.score || 0)) + ((direction==='positive') ? 1 : -1)}
        db.collection('ratings').update(id, rating, (err, result) => {
          if (req.userId) {
            const dbUserId = {_id: new ObjectId(req.userId)};
            db.collection('users').findOne(dbUserId, (err, user) => {
              let voted = user.voted || [];
              if (!voted.includes(ratingId)) {
                voted = [...voted, ratingId];
                db.collection('users').update(dbUserId, {...user, voted}, (err, result) => {
                  res.send(rating);
                });
              } else {
                res.send(rating);
              }
            });
          } else {
            res.send(rating);
          }
        })
      })

    })
  })

  /*should be replaced*/
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
