const shopsRoutes = require('./shops_routes');
const ratingsRoutes = require('./ratings_routes');
const servicesRoutes = require('./services_routes');
const authRoutes = require('./auth_routes');
const authenticationRoutes = require('./authentication_routes');

module.exports = (app, db) => {
  authRoutes(app, db);
  authenticationRoutes(app);
  shopsRoutes(app, db);
  ratingsRoutes(app, db);
  servicesRoutes(app, db);
};
