const { ObjectId } = require('mongodb');

module.exports = {
  getAggregateBookingsJson: (id, match) => {
    let aggregateJson = [
        {
          $lookup: {
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
          $lookup: {
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
          $project: {
              "_id": 1,
              "userId": 1,
              "shopId": 1,
              "status": 1,
              "date": 1,
              "comment": 1,
              "shopname": "$shops_docs.name",
              "username": "$users_docs.username"
          }
        }
      ];

      if (Object.keys(match).length > 0){
          aggregateJson.push({
            $match:{...match}
          });
      }
      return aggregateJson;
    }
}
