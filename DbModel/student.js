const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Name: String,
    Password: String,
    Email: String,
    Department: String,
    Semester: String,
    PhoneNumber: String
},{timestamps: true});

module.exports = mongo.model("student", Schema);
