var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var Users = require('../config/db').users;

// Define the User Schema
var activitySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    created_at: { type: Date },
    created_by: {type: ObjectId, ref: 'User', required: true }, // TODO: should insert the firstname also
    pickDates: [Date] 
});

// The primary user model
var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;