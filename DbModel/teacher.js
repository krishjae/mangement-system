const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Name: String,
    Password: String,
    Email: String,
    Department: String,
    ClassTeacher: Boolean,
    ClassDuty: String,
    Subjects: Array
},{timestamps: true});

module.exports = mongo.model("teacher", Schema);
