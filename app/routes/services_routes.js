var {ObjectId} = require('mongodb');

const router = require('express').Router();

module.exports = db => {
  router.route('')
    .get((req, res) => db.collection("shops").distinct("services", (err, docs) => res.send(docs)));
  return router;
};
