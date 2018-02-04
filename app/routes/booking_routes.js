const {ObjectId} = require('mongodb');
const authenticate = require('../passport/authenticate');

module.exports = (app, db) => {
  app.put('/shops/:id/bookings', (req, res) => {
    authenticate(req, res, () => {
      const booking = {
        ...req.body,
        shopId: req.params.id
      };
      db.collection("bookings").insert(booking, (err, result) => {
        res.send(result)
      });
    });
  });
};
