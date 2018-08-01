module.exports.getDbConnectionString = () => process.env.MONGO_CONNECTION_STRING;
module.exports.getJwtSecret = () => process.env.JWT_SECRET;
module.exports.getAppPort = () => process.env.PORT || 8000;
