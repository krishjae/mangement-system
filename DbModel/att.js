const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    department: String,
    semester: String,
    date: Date,
    data: Array
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
