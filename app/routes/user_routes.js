const {ObjectId} = require('mongodb');
const authenticate = require('../passport/authenticate');

const addFavorites = (user, shopId) => {
  let favorites = user.favorites === undefined ? [] : user.favorites;
  const index = favorites.indexOf(shopId);
  favorites = (index === -1)
    ? [...favorites, shopId]
    : [...favorites.slice(0, index), ...favorites.slice(index + 1)];
  return {...user, favorites};
}

module.exports = (app, db) => {

  app.put('/users/:id/favorites/:shopId', (req, res) => {
    authenticate(req, res, () => {
      const {shopId, id} = req.params;
      const shopObjectId = {_id: new ObjectId(shopId)};
      const userObjectId = {_id: new ObjectId(id)};
      db.collection("users").findOne({...userObjectId}, (err, user) => {
        if (user === null) {
          return res.status(400).send(false);
        }
        db.collection("shops").findOne({...shopObjectId}, (err, shop) => {
          if (shop === null) {
            return res.status(400).send(false);
          }
          db.collection("users").update(userObjectId, addFavorites(user, shopId), (err, result) => {
            res.status(200).send(true);
          });
        });
      });
    });
  });

  app.get('/users', (req, res) => {
    authenticate(req, res, () => {
      const filter = req.query.filter || '';
      db.collection('users')
        .find(
          //{...filter}
        )
        .toArray((err, docs) => {
          res.send(docs.map(user => ({
            id: user._id,
            username: user.username,
            admin: ((user.admin !== undefined) ? user.admin : false),
            moderateShops: ((user.moderateShops !== undefined) ? user.moderateShops : [])
          })));
        });
    });
  });

  app.get('/users/:id/favorites', (req, res) => {
    authenticate(req, res, () => {
      const userObjectId = {_id: new ObjectId(req.params.id)};
      db.collection("users").findOne({...userObjectId}, (err, user) => {
        if (user === null) {
          return res.status(400).send(false);
        }
        res.status(200).send(user.favorites === undefined ? [] : user.favorites);
      });
    });
  });
}
