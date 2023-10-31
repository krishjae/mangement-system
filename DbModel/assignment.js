const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Assignment: String,
    Class: String,
    Subject: String,
    AddedBy: String
},{timestamps: true});

module.exports = mongo.model("assignment", Schema);
