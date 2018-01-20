const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const passport = require('passport');
const localSignupStrategy = require('./app/passport/local-signup');
const localLoginStrategy = require('./app/passport/local-login');

const app = express();
/*
app.use(bodyParser.urlencoded({extended: true}))
  .use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/
app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(db.url, (err, database) => {
  const barbDb = database.db('barb');

  app.use(passport.initialize());
  passport.use('local-signup', localSignupStrategy(barbDb));
  passport.use('local-login', localLoginStrategy(barbDb));

  if (err) return console.log(err);
  require('./app/routes')(app, barbDb);
  const port = 8000;
  app.listen(port, () => {
    console.log("Listening carefully on port", port);
  });
});
