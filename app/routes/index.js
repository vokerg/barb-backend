const shopsRoutes = require('./shops_routes');
const ratingsRoutes = require('./ratings_routes');

module.exports = (app, db) => {
  shopsRoutes(app, db);
  ratingsRoutes(app, db);
};
