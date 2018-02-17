const { ObjectId } = require('mongodb');
const authenticate = require('../passport/authenticate');

module.exports = (app, db) => {
  app.put('/shops/:id/bookings', (req, res) => {
    authenticate(req, res, () => {
      const booking = {
        ...req.body,
        shopId: req.params.id
      };
      db.collection("bookings").insert({
        ...booking,
        userId: new ObjectId(booking.userId),
        shopId: new ObjectId(booking.shopId)
      }, (err, result) => {
        res.send(result)
      });
    });
  });

  app.get('/shops/:id/bookings', (req, res) => {
    //authenticate(req, res, () => {
      db.collection("bookings").aggregate(
        [
          {
            $lookup:
              {
                from: "shops",
                localField: "shopId",
                foreignField: "_id",
                as: "shops_docs"
              }
          }
          ,{
            $unwind: "$shops_docs"
          },
          {
            $lookup:
              {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "users_docs"
              }
          },
          {
            $unwind: "$users_docs"
          }
          ,{
            $project:
              {
                "_id": 1,
                "userId": 1,
                "shopId": 1,
                "shopname": "$shops_docs.name",
                "username": "$users_docs.username"
              }
          },
          {
            $match:
              {
                shopId: new ObjectId("5a5b6afbcea79c26d490f533")
              }
          }
        ]
      )
        .toArray((err, bookings) => {
        res.send(bookings);
      })
    //})
  });
};
