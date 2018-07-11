module.exports = (app, db) => {
  app.use('/signup/', require('./signupRoutes'));
  app.use('/login/', require('./loginRoutes'));
  app.use('/login/facebook', require('./socialRoutes'));
  app.use('/services/', require('./servicesRoutes')(db));
  app.use('/users/', require('./usersRoutes')(db));
  app.use('/shops/', require('./shopsRoutes')(db));
  app.use('/bookings/', require('./bookingRoutes')(db));
};
