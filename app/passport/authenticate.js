const jwt = require('jsonwebtoken');
const {jwtSecret, authenticate} = require('../../config');


module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send();
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).send();
    }
    else {
      next();
    }
  });
}
