const shopsRoutes = require('./shops_routes');
const ratingsRoutes = require('./ratings_routes');
const servicesRoutes = require('./services_routes');
const authRoutes = require('./auth_routes');

module.exports = (app, db) => {
  authRoutes(app, db);
  shopsRoutes(app, db);
  ratingsRoutes(app, db);
  servicesRoutes(app, db);
};
