const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { getAggregateBookingsJson, getSearchTimeObject } = require ('./mongoHelper');

const getJwtToken = userId => {
  const payload = {userId};
  return jwt.sign(payload, require('../config').getJwtSecret());
}

const getLoginResponseObject = (user, token=getJwtToken(user._id)) => ({
    success: true,
    userId: user._id,
    token,
    username: user.username,
    admin: ((user.admin !== undefined) ? user.admin : false),
    moderateShops: ((user.moderateShops !== undefined) ? user.moderateShops : [])
  });

const getSafeUser = user => ({
  username: user.username,
  favorites: user.favorites
})

const getAggregateBookings = (shopId, userId, status, time) => {
  const aggregateJson = getAggregateBookingsJson();
  let match = {};

  if (shopId) {
    const shopIdDb = {shopId: new ObjectId(shopId)};
    match = {...match, ...shopIdDb}
  }

  if (userId) {
    const userIdDb = {userId: new ObjectId(userId)};
    match = {...match, ...userIdDb}
  }

  if (status) {
    statusObject = (status === undefined || status==='All') ? {} : {'status': status};
    match = {...match, ...statusObject}
  }

  if (time) {
    timeObject = getSearchTimeObject(time);
    match = {...match, ...timeObject}
  }

  aggregateJson.push({
    $match:{...match}
  });

  return aggregateJson;
}

module.exports = {
  getLoginResponseObject,
  getJwtToken,
  getSafeUser,
  getAggregateBookings
};
