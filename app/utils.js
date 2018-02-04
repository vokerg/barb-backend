const jwt = require('jsonwebtoken');

const getJwtToken = userId => {
  const payload = {userId};
  return jwt.sign(payload, require('../config').jwtSecret);
}

const getLoginResponseObject = (user, token=getJwtToken(user.id)) => ({
    success: true,
    userId: user._id,
    token,
    username: user.username
  });

module.exports = {
  getLoginResponseObject,
  getJwtToken
};
