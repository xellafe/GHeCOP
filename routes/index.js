var express = require('express');
var path = require('path');
var WebServer = require('ws');

var addPatient = require('./addpatient');
var addHospital = require('./add_hospital');
var addDevice = require('./add_device');

var Hospital = require('../models/hospital');
var Patient = require('../models/patient');
var User = require('../models/user');
var Device = require('../models/device');

var router = express.Router();
const webSocketArray = [];

var isAuthenticated = function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

var isAuthenticatedBackend = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/backend/login');
}

module.exports = function(passport) {

    /****** SIGNUP PAGES ******/

    /* GET Registration Page */
    router.get('/signup', function(req, res) {
        Hospital.find().
        sort({ city: 1 }).
        exec(function(err, hospitals) {
            if (err) {
                console.error(err);
            } else {
                res.render('register', { message: req.flash('message'), hospitals: hospitals, title: "Register new user" });
            }
        });
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/user', // You may want to redirect to a phone number check page
        failureRedirect: '/signup',
        failureFlash: true
    }));

    /* First admin registration */
    router.get('/register_first_admin', function(req, res) {
        User.find().
        where('admin').equals(true).
        exec(function(err, admin) {
            if(err) {
                console.error(err);
            } 
            if(admin.length == 0) {
                res.render('register_first_admin', { message: req.flash('message'), title: "Admin registration" });
            } else 
                res.redirect('/backend');
        });
    });

    router.post('/register_first_admin', passport.authenticate('signupBackend', {
        successRedirect: '/backend',
        failureRedirect: '/register_first_admin',
        failureFlash: true
    }));

    /****** LOGIN PAGES ******/

    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('index', { message: req.flash('message'), title: "Global Healthcare Open Platform" });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    }));

    router.get('/backend/login', function(req, res) {
        res.render('backend_login', { message: req.flash('message'), title: "Admin login" });
    });

    router.post('/login_backend', passport.authenticate('loginBackend', {
        successRedirect: '/backend',
        failureRedirect: '/backend_login',
        failureFlash: true
    }));

    /****** OTHER PAGES ******/

    /* GET Home Page */
    router.get('/user', isAuthenticated, function(req, res) {
        Patient.find().
        where('doctor').equals(req.user._id).
        sort({ 'name.last': 1 }).
        exec(function(err, patients) {
            if (err) {
                console.error(err);
            } else {
                res.render('user', { user: req.user, patients: patients, title: "Dashboard - "+req.user.name.first+" "+req.user.name.last });
            }
        });
    });

    router.post('/addpatient', function(req, res) {
        if (addPatient(req.body)) {
            console.log("Patient added");
            res.redirect('/user');
        }
    });

    router.get('/devices', isAuthenticated, function(req, res) {
        Device.find().
        where('doctor_id').equals(req.user._id).
        sort({ 'name': 1 }).
        exec(function(err, devices) {
            if (err) {
                console.error(err);
            } else {
                res.render('devices', { user: req.user, devices: devices, title: "Devices Management" });
            }
        });
    });

    router.post('/adddevice', function(req, res) {
        if (addDevice(req.body)) {
            console.log("Device added");
            res.redirect('/devices');
        }
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/backend', isAuthenticatedBackend, function(req, res) {
        Hospital.find().
        sort({ city: 1 }).
        exec(function(err, hospitals) {
            if (err) {
                console.error(err);
            } else {
                res.render('backend', { user: req.user, hospitals: hospitals, title: "Backend Dashboard" });
            }
        });
    });

    router.post('/add_hospital', function(req, res) {
        if(addHospital(req.body)) {
            console.log("Hospital added");
            res.redirect('/backend');
        }
    });

    router.get('/ontology', function(req, res) {
        var filesDir = path.dirname(__dirname);

        var options = {
            root: filesDir + '/files',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }

        var fileName = 'GHECO.owl';
        res.sendFile(fileName, options, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Sent:', fileName);
            }
        });
    });

    const wss = new WebServer.Server({ port: 8080 });

    wss.on('connection', function connection(ws) {

        console.log("Connection established");
        var welcomeMessage = {
            device: "ghecop_server",
            action: "welcome",
            data: "Connection established. Welcome to GHeCOP.",
            time: Date.now()
        }

        ws.on('message', function incoming(msg) {
            var message = JSON.parse(msg);
            var action = message.action;
            switch(action) {
                case "send_medic_id": {
                    var keyValue = {
                        medic: message.data,
                        webSocket: ws
                    }
                    webSocketArray.push(keyValue);
                    wsSendData(ws, welcomeMessage);
                    break;
                }
                case "send_patient_id": {
                    // TODO Send user data
                    break;
                }
            }
        });

    });

    const deviceWSS = new WebServer.Server({ port: 8081 });

    deviceWSS.on('connection', function connection(ws) {
        // Define device connection behavior
    });

    return router;
}

var wsSendData = function(ws, data) {
    ws.send(JSON.stringify(data));
}