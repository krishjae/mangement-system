const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Filename: String,
    Class: String,
    Subject: String,
    UploadedBy: String
},{timestamps: true});

module.exports = mongo.model("notes", Schema);
