/**
 * Importing needed packages
 */
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

/**
 * Constant variables
 */
console.clear();
console.log("|*********************************************");
console.log("|          STARTING MINI PROJECT");
console.log("|*********************************************");
const oneDay = 1000 * 60 * 60 * 24;
const port = process.env.PORT || 3000;

/**
 * Config the epress server and cookie
 */
console.log("[LOG]: Loading App config...");
const app = express();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/cdn/note',express.static(path.join(__dirname, '/uploads/notes')));
app.use('/cdn/assignment',express.static(path.join(__dirname, '/uploads/assignments')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'dkvsunsfidnsvjdnsfdukwebku', name: 'uniqueSessionID', saveUninitialized: false, cookie: { maxAge: oneDay }, resave: false }));

/**
 * Mongoose events (optional)
 */
mongoose.connection.on("connected", (...args) => {
    console.log("[LOG]: Connected to MongoDB");
});
mongoose.connection.on("disconnected", (...args) => {
    console.log("[LOG]: Disconnected from MongoDB");
});
mongoose.connection.on("error", (error) => {
    console.log("[LOG]: Error on MongoDB connection");
    console.log(String(error));
});
console.log("[LOG]: Loaded App config");
/**
 * Main router handler
 */
console.log("[LOG]: Loading Main routers...");
app.get('/', function (req, res) {
    res.render('homepg');
});

app.get('/panel', function (req, res) {
    if (req.session.loggedIn) {
        switch(req.session.role){
            case "admin":{
                return res.redirect('/dashboard/admin');
            }
            case "student":{
                return res.redirect('/dashboard/student');
            }
            case "teacher":{
                return res.redirect('/dashboard/teacher');
            }
        }
    } else {
        res.redirect('/auth/login');
    }
});

/**
 * Importing modules(Routers)
 */
app.use("/auth", require('./Routers/Auth'));
app.use("/api", require('./Routers/Api'));
app.use("/dashboard", require('./Routers/DashBoard'));
console.log("[LOG]: Main routers loaded");
/**
 * Error Handlers
 */
console.log("[LOG]: Loading error handlers...");
app.use(function (req, res) {
    res.status(404).render('error-404');
});
app.use(async function (err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log(err, err.stack);
    res.status(500).send('Err occoured')
});
process.on('unhandledRejection', (reason, promise) => {
    console.log(`${promise}, ${reason.stack}`, reason);
});
process.on("uncaughtException", (err, origin) => {
    console.log(`${err.stack}, ${origin}`);
});
console.log("[LOG]: Error handlers Loaded.");
/**
 * Listening the port
 */
app.listen(port, () => {
    console.log(`[LOG]: MiniProject is running on port http://localhost:${port}/`);
    mongoose.set('strictQuery', true);
    console.log("[LOG]: Connecting to database...");
    mongoose.connect(process.env.MONGO, { useUnifiedTopology: true, useNewUrlParser: true });
});