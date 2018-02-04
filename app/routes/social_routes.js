const https = require("https");
const { getLoginResponseObject } = require("../utils");

module.exports = (app, db) => {
  app.post('/login/facebook', (request, response) => {
    https.get('https://graph.facebook.com/me?access_token=' + request.body.accessToken,
    (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        let facebookData = JSON.parse(data);
        if (facebookData.error !== undefined) {
          response.status(401).json({error: "Can't verify data"});
        } else {
          db.collection('users').find({facebookid:facebookData.id})
            .toArray((err, docs) => {
              if (docs.length === 0) {
                db.collection('users')
                  .insert(
                    {username: facebookData.name, facebookid: facebookData.id},
                    (err, result) => {
                      response.status(200).json(getLoginResponseObject(result.ops[0]))
                    }
                  )
              } else {
                response.status(200).json(getLoginResponseObject(docs[0]));
              }
            })
        }
      });

    }).on("error", (err) => {
      response.status(401).json({error: "Can't verify data"});
    });
  });
}
