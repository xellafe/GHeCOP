var login = require('./login');
var signup = require('./signup');
var loginBackend = require('./login_backend');
var signupBackend = require('./signup_backend');
var User = require('../models/user');

module.exports = function(passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //console.log('serializing user: ');
        //console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            //console.log('deserializing user:', user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    loginBackend(passport);
    signup(passport);
    signupBackend(passport);

}