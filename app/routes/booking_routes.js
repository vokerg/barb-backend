const { ObjectId } = require('mongodb');
const authenticate = require('../passport/authenticate');
const { getAggregateBookingsJson } = require("./mongo_helper");

module.exports = (app, db) => {
  app.put('/shops/:id/bookings', (req, res) => {

    authenticate(req, res, () => {
      const booking = {
        ...req.body,
        shopId: req.params.id
      };
      console.log(booking, booking.date, new Date(booking.date))
      db.collection("bookings").insert({
        ...booking,
        userId: new ObjectId(booking.userId),
        shopId: new ObjectId(booking.shopId),
        date: new Date(booking.date)
      }, (err, result) => {
        res.send(result)
      });
    });
  });

  app.get('/shops/:id/bookings', (req, res) => {
    console.log(new Date())
    //authenticate(req, res, () => {
      const id = {_id: new ObjectId(req.params.id)};
      db.collection("bookings")
        //.aggregate(getAggregateBookingsJson(id))
        .find(
          {date: {
          $lt: new Date()
        }}
      )
        .toArray((err, bookings) => {
        res.send(bookings);
      })
    //})
  });
};
