const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Marks: Number,
    Class: String,
    Subject: String,
    StudentId: String,
    AddedBy: String
},{timestamps: true});

module.exports = mongo.model("marks", Schema);
