// Include Express
var express = require('express');

// Initialize the Router
var router = express.Router();
var moment = require('moment');
var _ = require('underscore');
var color = require('cli-color');
var db = require('../config/db');
var Activity = db.activities;

router.use(function(req, res, next){
    
    if(req.method === "GET"){
        // continue to next middleware
        return next();
    }

    if(!req.isAuthenticated()){
        res.redirect('/#login');
    }

    //user authenticated, continue to next middleware
    return next();
});

// Setup the Route
router.route('/activities')
    // Create new activity
    .post(function(req, res){
        var body = req.body;
        var time = moment().format('MMMM Do YYYY, h:mm:ss a');

        // Find if there's already an activity with the same title
        Activity.findOne({
            'title' : body.title
        }, function(err, activity){
            if (err) {
                // Nice log message on your end, so that you can see what happened
                console.log('Couldn\'t create new activity at ' + color.red(time) + ' name ' + color.red(body.title) + ' because of: ' + err);

                // send the error
                res.status(500).json({
                    'message': 'Internal server error from signing up new user. Please contact support@yourproject.com.'
                });
            }

            // If no activity found, create a new one
            if (!activity) {
                console.log('Creating a new activity at ' + color.green(time) + ' with the title: ' + color.green(body.title));

                var newActivity = new Activity({
                    title : body.title,
                    description : body.description,
                    created_at : new Date(),
                    created_by : req.user
                });

                // save the activity to the database
                newActivity.save(function(err, savedActivity) {

                    if (err) {
                        console.log('Problem saving the activity ' + color.yellow(body.title) + ' due to ' + err);
                        res.status(500).json({
                            'message': 'Database error trying to save activity.  Please contact support@yourproject.com.'
                        });
                    }

                    // Log success and send the filtered user back
                    console.log('Successfully created new activity: ' + color.green(body.activity));

                    res.status(201).json({
                        'message': 'Successfully created new activity',
                        'client': savedActivity
                    });

                });
            }
        });
    })

    // Get all activities
    .get(function (req, res) {
        Activity.find(function (err, activities) {

            if (err) {
                return res.send(500, err);
            }
            return res.send(200, activities);
        });
    });

router.route('/activities/:id')
    // Get an activity
    .get(function (req, res) {
        Activity.findById(req.params.id).populate("created_by", "firstname").exec(function (err, activity) {

            if (err) {
                return res.send(500, err);
            }
            return res.send(200, activity);
        });
    })

    // Update a specific activity
    .put(function (req, res) {
        Activity.findById(req.params.id, function (err, activity) {
            if (err) {
                return res.send(500, err);
            }

            activity.title = req.body.title;
            activity.description = req.body.description;

            activity.save(function(err, act){
                if (err)
                    res.send(err);

                //res.json(activity);
                return res.status(200).send(act);
            });
        });
    })

    // Delete an activity
    .delete(function(req, res){
        Activity.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            return res.status(204);
        });
    });

router.route('/pickactivities')
    // Pick a random activity
    .get(function (req, res) {
        Activity.count().exec(function (err, count) {

            // Get a random entry
            var random = Math.floor(Math.random() * count)

            // Again query all elements but only fetch one offset by our random #
            Activity.findOne().skip(random).populate("created_by", "firstname").exec(
                function (err, activity) {
                    console.log(activity);
                    // Tada! random elements
                    if (err) {
                        return res.send(500, err);
                    }
                    return res.send(200, activity);
                })
        })
    });

router.route('/pickactivities/accept/:id')
    .put(function (req, res) {
        Activity.findByIdAndUpdate(req.params.id,
            { $push: { "pickDates": new Date() } },
            { safe: true, upsert: false },
            function (err, activity) {
                if (err) {
                    console.log(err);
                    return res.send(500, err);
                }
                return res.send(200, activity);
            });
    });

// router.route('/activities/pick/:id')
    // Edit 

// Expose the module
module.exports = router;