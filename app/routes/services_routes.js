var {ObjectId} = require('mongodb');

module.exports = (app, db) => {
  app.get('/services/', (req, res) => {
    db.collection("shops").distinct("services", (err, docs) => {
      res.send(docs)
    })
  });
};
