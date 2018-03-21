const { ObjectId } = require('mongodb');
const authenticate = require('../passport/authenticate');
const { getAggregateBookingsJson } = require("./mongo_helper");

module.exports = (app, db) => {
  app.put('/shops/:id/bookings', (req, res) => {

    authenticate(req, res, () => {
      const booking = {
        ...req.body,
        shopId: req.params.id,
        status: 'Unprocessed'
      };
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
    let {status, time} = req.query;

    let timeObject = {};
    switch(time) {
      case 'Past': timeObject = {date: {$lt: new Date()}}; break;
      case 'Future': timeObject = {date: {$gte: new Date()}}; break;
    };

    let statusObject = (status === undefined || status==='All') ? {} : {'status': status};

    //authenticate(req, res, () => {
      const id = {_id: new ObjectId(req.params.id)};
      db.collection("bookings")
        .aggregate(getAggregateBookingsJson(id, {...timeObject, ...statusObject}))
        .toArray((err, bookings) => {
        res.send(bookings);
      })
    //})
  });

  app.post('/shops/:shopId/bookings/:bookingId', (req, res) => {
    console.log("params:", req.params.shopId, req.params.bookingId)
    const shopId = {shopId: new ObjectId(req.params.shopId)};
    const bookingId = {_id: new ObjectId(req.params.bookingId)};
    db.collection("bookings").findOne({...bookingId, ...shopId}, (err, booking) => {
      const {status} = req.body;
      booking = {
        ...booking,
        status
      }
      db.collection("bookings").update(shopId, booking, (err, result) => res.send(booking));
    })
  })
};
