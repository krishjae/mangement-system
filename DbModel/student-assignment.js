const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Topic: String,
    Subject: String,
    Student: String,
    File: String
},{timestamps: true});

module.exports = mongo.model("studentassignment", Schema);
