const { ObjectId } = require('mongodb');

module.exports = {
  getAggregateBookingsJson: id => {
    return
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
              shopId: id
            }
        }
      ]
    }
}
