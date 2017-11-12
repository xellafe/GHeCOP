var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var apikey = require('apikeygen').apikey;

module.exports = function(passport) {

    passport.use('signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            findOrCreateUser = function() {
                // find a user in Mongo with provided username
                User.findOne({ 'email': email }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        //console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user && !user.admin) {
                        // L'utente esiste e non è admin
                        console.log("L'utente esiste ma è admin");
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } 
                    if (user && !user.medic) {
                        // L'utente esiste ma è admin
                        console.log("L'utente esiste ma è admin");
                        user.birthdate = Date.parse(req.body.birthdate);
                        user.hospital = req.body.hospital;
                        user.phone = req.body.tel;
                        user.medic = true;
                        user.created = user.created;
                        user.updated = Date.now;
                        user.save(function(err) {
                            if(err)
                                throw err;
                            return done(null, user);
                        });
                    } else {
                        // L'utente non esiste o l'email è utilizzata da un admin
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.name.first = req.body.firstName;
                        newUser.name.last = req.body.lastName;
                        newUser.birthdate = Date.parse(req.body.birthdate);
                        newUser.hospital = req.body.hospital;
                        newUser.email = req.body.email;
                        newUser.admin = false;
                        newUser.medic = true;
                        newUser.password = createHash(password);
                        newUser.phone = req.body.tel;
                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                //console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            //console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    // Generates hash using bCrypt
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}