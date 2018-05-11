const { ObjectId } = require('mongodb');
const authenticate = require('../../passport/authenticate');

const addFavoriteShopToUserObject = (user, shopId) => {
  let favorites = user.favorites === undefined ? [] : user.favorites;
  const index = favorites.indexOf(shopId);
  favorites = (index === -1)
    ? [...favorites, shopId]
    : [...favorites.slice(0, index), ...favorites.slice(index + 1)];
  return {...user, favorites};
}

module.exports = db => {
  const router = require('express').Router();

  router.route('').get((req, res) => authenticate(req, res, () =>
      db.collection("users").findOne(req.dbUserId, (err, user) =>
        (user === null)
          ? res.status(400).send(false)
          : res.status(200).send(user.favorites === undefined ? [] : user.favorites)
      )
  ));

  router.route('/:shopId').put((req, res) =>
    authenticate(req, res, () => {
      const { shopId } = req.params;
      db.collection("users").findOne(req.dbUserId, (err, user) =>
        (user === null)
          ? res.status(400).send(false)
          : db.collection("shops").findOne({_id: new ObjectId(shopId)}, (err, shop) =>
            (shop === null)
              ? res.status(400).send(false)
              : db.collection("users").update(req.dbUserId, addFavoriteShopToUserObject(user, shopId), (err, result) =>
                res.status(200).send(true)
              )
          )
      );
    })
  );

  return router;
}
