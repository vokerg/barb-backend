const authRoutes = require('./auth_routes');
const bookingRoutes = require('./booking_routes');
const socialRoutes = require('./social_routes');
const userRoutes = require('./user_routes');

module.exports = (app, db) => {
  authRoutes(app, db);
  socialRoutes(app, db);
  bookingRoutes(app, db);
  userRoutes(app, db);
  app.use('/services/', require('./services_routes')(db));
  app.use('/shops/', require('./shops_routes')(db));
};
