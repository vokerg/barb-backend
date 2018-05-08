const jwt = require('jsonwebtoken');

const getJwtToken = userId => {
  const payload = {userId};
  return jwt.sign(payload, require('../config').jwtSecret);
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

module.exports = {
  getLoginResponseObject,
  getJwtToken,
  getSafeUser
};
