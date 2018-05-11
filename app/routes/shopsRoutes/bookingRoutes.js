const { ObjectId } = require('mongodb');
const authenticate = require('../../passport/authenticate');
const { getAggregateBookingsJson, getSearchTimeObject } = require("../../mongoHelper");

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
    let
      {status, time} = req.query,
      timeObject = getSearchTimeObject(time),
      statusObject = (status === undefined || status==='All') ? {} : {'status': status};

      db.collection("bookings")
        .aggregate(getAggregateBookingsJson(req.shopId, {...timeObject, ...statusObject}))
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
