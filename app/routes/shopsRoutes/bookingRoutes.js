const { ObjectId } = require('mongodb');
const authenticate = require('../../passport/authenticate');
const { getAggregateBookings } = require("../../utils");

module.exports = db => {
  const router = require('express').Router();

  router.route('').put((req, res) =>
    authenticate(req, res, () => {
      const booking = {
        ...req.body,
        shopId: req.shopId,
        status: 'Unprocessed'
      };
      db.collection("bookings").insert({
        ...booking,
        userId: new ObjectId(booking.userId),
        shopId: new ObjectId(booking.shopId),
        date: new Date(booking.date)
      }, (err, result) => res.send(result));
    })
  )

  .get((req, res) => authenticate(req, res, () => {
    const {status, time} = req.query;
      db.collection("bookings")
        .aggregate(getAggregateBookings(req.shopId, null, status, time))
        .toArray((err, bookings) => res.send(bookings))
  }));

  router.route('/:bookingId').post((req, res) => {
    const shopId = {shopId: new ObjectId(req.shopId)};
    const bookingId = {_id: new ObjectId(req.params.bookingId)};
    db.collection("bookings").findOne({...bookingId, ...shopId}, (err, booking) => {
      const {status} = req.body;
      booking = {...booking, status}
      db.collection("bookings").update(bookingId, booking, (err, result) => res.send(booking));
    })
  })


  return router;
}
