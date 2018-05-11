const { ObjectId } = require('mongodb');
const authenticate = require('../../passport/authenticate');

module.exports = db => {
  const router = require('express').Router();

  router.route('').get((req, res) =>
    authenticate(req, res, () => {
      let filter = req.query.filter || '';
      filter = (filter !== '') ? {"username": new RegExp(filter + ".*", 'i')} : {};
      db.collection('users')
        .find({...filter})
        .toArray((err, docs) =>
          res.send(docs.map(user => ({
            id: user._id,
            username: user.username,
            admin: ((user.admin !== undefined) ? user.admin : false),
            moderateShops: ((user.moderateShops !== undefined) ? user.moderateShops : [])
          })))
        );
    })
  );

  router.use('/:id', (req, res, next) => {
    req.userId = req.params.id;
    req.dbUserId = {_id: new ObjectId(req.params.id)};
    next();
  }, require('./userRoutes')(db));

  return router;
}
