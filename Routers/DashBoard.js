const express = require('express');
router = express.Router();
const Teacher = require('../DbModel/teacher');
const Student = require('../DbModel/student');

//Admin
router.get('/admin', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login/admin')
    else {
        if(req.session.role == 'admin') res.render('admin/main', {user: req.session.user});
        else res.render('error');
        
    }
});
router.get('/admin/viewstudent', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login/admin')
    else {
        if(req.session.role == 'admin') res.render('admin/viewstudent', {user: req.session.user});
        else res.render('error');
        
    }
});
router.get('/admin/viewteacher', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login/admin')
    else {
        if(req.session.role == 'admin') res.render('admin/viewteacher', {user: req.session.user});
        else res.render('error');
        
    }
});
router.get('/admin/add-student', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login/admin')
    else {
        if(req.session.role == 'admin') res.render('admin/add-student', {user: req.session.user});
        else res.render('error');
    }
});
router.get('/admin/add-teacher', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login/admin')
    else {
        if(req.session.role == 'admin') res.render('admin/add-teacher', {user: req.session.user});
        else res.render('error');
    }
});


router.get('/teacher', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login/teacher')
    else {
        if(req.session.role == 'teacher') res.render('teacher/trindex', {user: req.session.user})
        else res.render('error');
    }
});


router.get('/teacher/uploadnote', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.role == 'teacher') res.render('teacher/uploadnote', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/student/noteview', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.user.Role == 'student') res.render('noteview', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/teacher/addmark', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        const _students = await Student.find({});
        if(req.session.role == 'teacher') res.render('teacher/addmark', {user: req.session.user, students: _students})
        else res.render('error');
    }
});
router.get('/student/notes', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.user.Role == 'student') res.render('notes', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/teacher/assignassignment', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.role == 'teacher') res.render('teacher/assignassignment', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/teacher/viewassignment', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.role == 'teacher') res.render('teacher/viewassignment', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/student/studassignment', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.user.Role == 'student') res.render('assignment', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/teacher/trviewmark', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.role == 'teacher') res.render('teacher/trviewmark', {user: req.session.user})
        else res.render('error');
    }
});

router.get('/teacher/attendanceupload', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.role == 'teacher') res.render('teacher/attendanceupload', {user: req.session.user})
        else res.render('error');
    }
});

router.get('/teacher/studentlist', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.user.Role == 'teacher') res.render('students', {user: req.session.user})
        else res.render('error');
    }
});

router.get('/admin/studentedit', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.user.Role == 'admin') res.render('edit-student', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/teacher/trviewattendance', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.role == 'teacher') res.render('teacher/trviewattendance', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/student', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login/student')
    else {
        if(req.session.role == 'student') res.render('student/studenthome', {user: req.session.user})
        else res.render('error');
    }
});

router.get('/student/viewattendance', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        if(req.session.role == 'student') res.render('student/viewattendance', {user: req.session.user})
        else res.render('error');
    }
});
router.get('/student/uploadassignment', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        let subs = await Teacher.findOne({"ClassDuty":req.session.user.Semester});
        if(req.session.role == 'student') res.render('student/uploadassignment', {user: req.session.user, Subjects: subs?.Subjects})
        else res.render('error');
    }
});
router.get('/student/viewmark', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        let subs = await Teacher.findOne({"ClassDuty":req.session.user.Semester});
        if(req.session.role == 'student') res.render('student/viewmark', {user: req.session.user, Subjects: subs?.Subjects})
        else res.render('error');
    }
});

router.get('/student/viewnote', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else {
        let subs = await Teacher.findOne({"ClassDuty":req.session.user.Semester});
        if(req.session.role == 'student') res.render('student/viewnote', {user: req.session.user, Subjects: subs?.Subjects})
        else res.render('error');
    }
});
module.exports = router;