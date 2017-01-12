/**
 * The Index of Routes
 */
var passport = require('passport');

module.exports = function (app) {

    // The signup route
    app.use('/auth', require('../routes/authenticate')(passport));
    // The API route
    app.use('/api', require('../routes/api'));
}