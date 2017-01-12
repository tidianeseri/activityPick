var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var moment = require('moment');
var _ = require('underscore');
var color = require('cli-color');
var db = require('./db');
var User = db.users;

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('Serializing user:', user._id);

        // return the unique id
        return done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (!user) {
                return done('user ' + id + ' not found', false);
            }

            return done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {

            User.findOne({ email: username }, function (err, user) {

                if (err) {
                    return done(err, false);
                }

                if (!user) {
                    return done(null, false, {message: 'User ' + username + ' not found'});
                }

                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: 'Invalid password for user '+user.email});
                }

                //successful signed in
                console.log('Successfully logged in');
                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password1',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) {

            var time = moment().format('MMMM Do YYYY, h:mm:ss a');
            var body = req.body;

            User.findOne({ 'email': username }, function (err, user) {

                if (err) {
                    return done(err, false);
                }

                if (user) {
                    // Nice log message on your end, so that you can see what happened
                    console.log('Couldn\'t create new user ' + color.red(username) + ' at ' + color.red(time) + ' because user already exist.');
                    return done(null, false, {message : 'Couldn\'t create new user ' + username + ' at ' + time + ' because user already exist.'});
                }

                //user.password = createHash(password);

                // setup the new user
                var newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: username,
                    password: password
                });

                // save the user to the database
                newUser.save(function (err, savedUser, numberAffected) {

                    if (err) {
                        console.log('Problem saving the user ' + color.yellow(body.email) + ' due to ' + err);
                        return done(err, false);
                    }

                    // Log success and send the filtered user back
                    console.log('Successfully created new user: ' + color.green(username) + ' ' + numberAffected);

                    return done(null, newUser);
                });
            });
        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };

};  