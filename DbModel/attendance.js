const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    month: String,
    name: String,
    department: String,
    semester: String,
    totalpresent: Number
},{timestamps: true});

module.exports = mongoose.model("attendance", AttendanceSchema);