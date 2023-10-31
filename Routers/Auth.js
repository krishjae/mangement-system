const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const AdminDB = require('../DbModel/admin');
const TeacherDB = require('../DbModel/teacher');
const StudentDB = require('../DbModel/student');


router.get('/', (req, res) => {
   return res.redirect('/auth/login');
});

router.get('/login', function (req, res) {
   if (req.session.loggedIn) {
      res.redirect('/panel');
   } else {
      res.redirect('/auth/login/student');
   }
});

router.get('/login/student', function (req, res) {
   if (req.session.loggedIn) {
      res.redirect('/panel');
   } else {
      res.render('student/login');
   }
});
router.get('/login/teacher', function (req, res) {
   if (req.session.loggedIn) {
      res.redirect('/panel');
   } else {
      res.render('teacher/login');
   }
});
router.get('/login/admin', function (req, res) {
   if (req.session.loggedIn) {
      res.redirect('/panel');
   } else {
      res.render('admin/login');
   }
});

router.get('/logout', (req, res) => {
   req.session.destroy((err) => { });
   res.redirect('/auth/login');
});
router.post('/signup', async function (req, res, next) {
   if (req.body.password != req.body.cpassword) return res.redirect('/auth/login?path=signup&err=passnotmatch');
   const user = await UserDB.findOne({ "Email": req.body.email });
   if (user) return res.redirect('/auth/login?path=signup&err=userexist');
   next();
}, (req, res) => {
   
       const newStudent = new StudentDB({
         "Email": req.body.email,
         "Password": passwordHash.generate(req.body.password),
         "FirstName": req.body.firstname,
         "LastName": req.body.lastname,
         "PhoneNumber":req.body.PhoneNumber,
         "Department": "BCA"
         
       });

       
       newStudent.save(async (err, student) => {
           if (err) return res.redirect('/auth/login?path=signup&err=dberror');
           let Count = await AppStats.findOne({});
           Count.Users++;
           await AppStats.updateOne({},{Users: Count.Users});
           req.session.loggedIn = true;
           req.session.username = user.FirstName;
           user.Password = null;
           req.session.user = user;
           req.session.userid = user._id;
           res.redirect('/dashboard');
       });
   });



router.post('/login/admin', async (req, res) => {
   const { Email, Password } = req.body;
   const user = await AdminDB.findOne({ Email, Password});
   if (user) {
      req.session.user = user;
      req.session.role = "admin";
      req.session.loggedIn = true;
      res.redirect('/dashboard/admin');
   } else {
      res.redirect('/auth/login/admin');
   }
});

//  teachers and students
router.post('/login/teacher', async (req, res) => {
   const { Email, Password } = req.body;
   const teacher = await TeacherDB.findOne({ Email, Password});
   if (teacher) {
      req.session.user = teacher;
      req.session.role = "teacher";
      req.session.loggedIn = true;
      res.redirect('/dashboard/teacher');
   } else {
      res.redirect('/auth/login/teacher');
   }
});

router.post('/login/student', async (req, res) => {
   const { Email, Password } = req.body;
   const student = await StudentDB.findOne({ Email, Password});
   if (student) {
      req.session.user = student;
      req.session.role = "student";
      req.session.loggedIn = true;
      res.redirect('/dashboard/student');
   } else {
      res.redirect('/auth/login/student');
   }
});
module.exports = router;