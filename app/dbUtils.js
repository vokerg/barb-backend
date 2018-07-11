const handleDbUser = db => dbUserId => handle => db.collection('users').findOne(dbUserId, (err, user) => handle(user))

module.exports = {
  handleDbUser
}
