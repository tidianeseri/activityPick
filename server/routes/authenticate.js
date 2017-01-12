var express = require('express');
var router = express.Router();

module.exports = function(passport){

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        res.send({state: 'failure', user: null, message: "Invalid username or password"});
    });

    //log in
    router.post('/login', function (req, res, next) {
        passport.authenticate('login', function (err, user, info) {
            if (err) {
                console.log(err);
                return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting authentication status
            if (!user) {
                return res.status(403).send({ status: 'failure', user: null, message: info.message });
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.send({ success: true, status: 'success', user: req.user ? req.user : null, message: 'Authentication succeeded' });
            });
        })(req, res, next);
    });

    //sign up
    router.post('/signup', function (req, res, next) {
        passport.authenticate('signup', function (err, user, info) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting authentication status
            if (!user) {
                return res.status(403).send({ status: 'failure', user: null, message: info.message });
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.send({ success: true, status: 'success', user: req.user ? req.user : null, message: 'Signup and authentication succeeded' });
            });
        })(req, res, next);
    });

    //is logged in
    router.post('/isloggedin', function (req, res) {
        if (req.isAuthenticated()) {
            res.send({ state: 'success', user: req.user });
        }
        else {
            res.send({ state: 'failure', user: null });
        }
    });

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        //res.send(401);
        res.send();
        //res.redirect('/auth/success');
    });

    return router;

}