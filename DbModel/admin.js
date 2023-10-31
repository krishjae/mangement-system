const mongo = require('mongoose');

const Schema = new mongo.Schema({
    FirstName: String,
    LastName: String,
    Password: String,
    Email: String
},{timestamps: true});

module.exports = mongo.model("admin", Schema);
