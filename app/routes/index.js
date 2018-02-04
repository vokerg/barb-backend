const shopsRoutes = require('./shops_routes');
const ratingsRoutes = require('./ratings_routes');
const servicesRoutes = require('./services_routes');
const authRoutes = require('./auth_routes');
const bookingRoutes = require('./booking_routes');
const socialRoutes = require('./social_routes');

module.exports = (app, db) => {
  authRoutes(app, db);
  socialRoutes(app, db);
  shopsRoutes(app, db);
  ratingsRoutes(app, db);
  servicesRoutes(app, db);
  bookingRoutes(app, db);
};
