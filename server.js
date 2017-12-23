const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(db.url, (err, database) => {
  const barbDb = database.db('barb');

  if (err) return console.log(err);
  require('./app/routes')(app, barbDb);
  const port = 8000;
  app.listen(port, () => {
    console.log("Listening carefully...");
  });
});
