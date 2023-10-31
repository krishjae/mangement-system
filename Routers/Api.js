const express = require('express');
const router = express.Router();
const Student = require('../DbModel/student');
const Teacher = require('../DbModel/teacher');
const Note = require('../DbModel/note');
const Mark = require('../DbModel/mark');
const Assignment = require('../DbModel/assignment');
const StudentAssignment = require('../DbModel/student-assignment');
const Attendance = require('../DbModel/att');
const fileupload = require("express-fileupload");

//Student add/delete/view
router.post('/admin/addstudent', async (req, res) => {
    new Student(req.body).save();
    return res.json({ "status": 200, "message": "Student added successfully" });
})
router.get('/admin/viewstudents', async (req, res) => {
    let students = await Student.find({});
    return res.json({ "status": 200, "message": "Students fetched successfully", "data": students });
})
router.delete('/admin/deletestudent', async (req, res) => {
    const id = req.body.id;
    if (!id) return res.json({ "status": 403, "message": "Provide student id" });
    await Student.deleteOne({ "_id": id })
    return res.json({ "status": 200, "message": "Student deleted successfully" });
})
//Teacher add/delete/view
router.post('/admin/addteacher', async (req, res) => {
    console.log(req.body);
    new Teacher(req.body).save();
    return res.json({ "status": 200, "message": "Teacher added successfully" });
})
router.get('/admin/viewteachers', async (req, res) => {
    let teachers = await Teacher.find({});
    return res.json({ "status": 200, "message": "Teacher fetched successfully", "data": teachers });
})
router.delete('/admin/deleteteacher', async (req, res) => {
    const id = req.body.id;
    if (!id) return res.json({ "status": 403, "message": "Provide teacher id" });
    await Teacher.deleteOne({ "_id": id })
    return res.json({ "status": 200, "message": "Teacher deleted successfully" });
})

router.post('/teacher/uploadnote', fileupload(), async (req, res) => {
    const file = req.files.file;
    const fpath = "./uploads/notes/" + file.name;
    file.mv(fpath, (err) => {
        if (err) {
            console.log("Err in note upload: ", err);
            return res.status(500).json({ "status": 500, "message": "Failes to upload the notes" });
        } else {
            const body = req.body;
            new Note({
                Filename: file.name,
                Class: body.semester,
                Subject: body.subject,
                UploadedBy: req.session.user.Name
            }).save(err => {
                if (err) {
                    console.error('Error while saving note : ', err);
                    return res.status(500).send({ "status": 500, "message": 'Failed to save note' });
                } else {
                    return res.json({ "status": 200, "message": "Note uploaded successfully" });
                }
            })
        }
    })
})

router.post('/teacher/addassignment', async (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body) res.status(500).json({ "status": 500, "message": "Provide data to add assignment" });
    else {
        new Assignment({
            Assignment: body.title,
            Class: body.semester,
            Subject: body.subject,
            AddedBy: req.session.user.Name
        }).save(err => {
            if (err) {
                console.error('Error while saving assignment : ', err);
                return res.status(500).send({ "status": 500, "message": 'Failed to save assignment' });
            } else {
                return res.json({ "status": 200, "message": "assignment updated successfully" });
            }
        })
    }
})

router.get('/teacher/listassignment', async (req, res) => {
    let subject = req.query.subject || "";
    const assign = await StudentAssignment.find({ "Subject": subject });
    if (!assign.length) {
        return res.status(401).json({ "status": 401, "message": "No such assignment found!" });
    } else {
        return res.status(200).json({ "status": 200, "data": assign });
    }
})

router.post('/teacher/addmark', async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(500).json({ "status": 500, "message": "Please provide mark details." });
    } else {
        try {
            const allStudents = await Student.find({});
            for (const key in body.mark) {
                let student = allStudents.find(e => e._id == key)
                const mark = body.mark[key];
                new Mark({
                    StudentId: key,
                    Marks: mark,
                    Class: student.Semester,
                    Subject: req.session.user.Subjects[parseInt(student.Semester.slice(9, 10)) - 1],
                    AddedBy: req.session.user.Name
                }).save();
            }
            return res.status(200).json({ "status": 200, "message": "Marks added Successfully!" })
        } catch (e) {
            console.log(e);
            res.status(500).json({ "status": 500, "message": "Failed to add marks" })
        }
    }
})

router.post('/teacher/viewmark', async (req, res) => {
    const body = req.body;
    const _studlist = await Student.find({});
    if (!body) {
        return res.status(500).json({ "status": 500, "message": "Please provide the subject and semester" });
    } else {
        try {
            const marklist = await Mark.find({"Class":body.semester, "Subject":body.subject});
            if(!marklist.length){
                return res.status(401).json({"status":401,"message":"No Marks Found For This Semester And Subject Combination"})
            }else{
                marklist.forEach(e=>{
                    let stud = _studlist.find(stu=> stu._id==e.StudentId);
                    delete stud.__v;
                    e['StudentId']=stud.Name;
                })
                return res.status(200).json({ "status": 200, "data": marklist });
            }
        }catch(e){
            console.log(e);
        }
    }
})

//Student area
router.get("/student/getnote", async function (req, res) {
    let sem = req.query.semester;
    let subj = req.query.subject;
    try {
        if (sem != req.session.user.Semester) return res.status(403).json({ "status": 403, "message": "Select your semester to view notes" });
        const result = await Note.find({ Class: sem, Subject: subj }).sort({ _id: -1 });
        return res.status(200).json({ "status": 200, "message": "Avaliable notes", "notes": result });
    } catch (e) {
        console.log(e);
        return res.status(403).json({ "status": 403, "message": "Unable to fetch notes" });
    }
})
router.post('/student/getassignmenttopic', async (req, res) => {
    const body = req.body;
    const assign = await Assignment.findOne({ "Subject": body.subject });
    if (!assign) {
        return res.status(403).json({ "status": 403, "message": "No such assignment found!" });
    } else {
        return res.status(200).json({ "status": 200, "message": "Assignments Found!", "topics": assign });
    }
})

router.post('/student/uploadassignment', fileupload(), async (req, res) => {
    const file = req.files.file;
    const fpath = "./uploads/assignments/" + file.name;
    const _studassign = await StudentAssignment.findOne({ "Student": req.session.user.Name, "Topic": req.body.topic });
    if (_studassign) return res.status(403).json({ "status": 403, "message": "You already uploaded assignment for this subject" });
    file.mv(fpath, (err) => {
        if (err) {
            console.log("Err in assignment upload: ", err);
            return res.status(500).json({ "status": 500, "message": "Failes to upload the assignment" });
        } else {
            const body = req.body;
            new StudentAssignment({
                File: file.name,
                Topic: body.topic,
                Subject: body.subject,
                Student: req.session.user.Name
            }).save(err => {
                if (err) {
                    console.error('Error while saving assignment : ', err);
                    return res.status(500).send({ "status": 500, "message": 'Failed to save assignment' });
                } else {
                    return res.json({ "status": 200, "message": "Assignment uploaded successfully" });
                }
            })
        }
    })
})

router.post('/student/viewmark', async (req, res) => {
    const body = req.body;
    const _studlist = await Student.find({});
    if (!body) {
        return res.status(500).json({ "status": 500, "message": "Please provide the subject" });
    } else {
        try {
            const marklist = await Mark.find({"Class":req.session.user.Semester, "Subject":body.subject, "StudentId": req.session.user._id});
            if(!marklist.length){
                return res.status(401).json({"status":401,"message":"No Marks Found For This Subject"})
            }else{
                return res.status(200).json({ "status": 200, "data": marklist });
            }
        }catch(e){
            console.log(e);
        }
    }
})
router.post('/teacher/attendanceupload', async (req, res) => {
    try {
        console.log(req.body);
        const { department, semester, date, data } = req.body;

       
        const newAttendance = new Attendance({
            department,
            semester,
            date,
            data
        });

        await newAttendance.save();

        res.status(201).json({ message: 'Attendance saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save attendance' });
    }
});
router.post('/teacher/attendance', (req, res) => {
    const newAttendance = new Attendance({
      month: req.body.month,
      name: req.body.name,
      department: req.body.department,
      semester: req.body.semester,
      totalpresent: req.body.totalpresent
    });
  
    newAttendance.save()
      .then(item => res.json(item))
      .catch(err => res.status(400).json({ message: err.message }));
  });

module.exports = router;
