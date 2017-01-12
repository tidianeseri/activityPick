process.env.NODE_ENV = 'test';

//const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server/app');
const should = chai.should();
chai.use(chaiHttp);

var db = require('../../server/config/db');
var User = db.users;

describe('Users Login/Signup', function () {

    // after(function (done) {
    //     mongoose.connection.close();
    //     done();
    // });

    beforeEach(function (done) {
        var newUser = new User({
            firstname: "firsttest",
            lastname: "lasttest",
            email: "test@test.ca",
            password: "password"
        });

        newUser.save(function (error) {
            if (error) console.log('error' + error.message);
            done();
        });
    });

    afterEach(function (done) {
        User.remove({}, function () {
            done();
        });
    });

    it('should login on /auth/login POST', function(done) {
        chai.request(server)
            .post('/auth/login')
            .send({email: "test@test.ca", password: "password"})
            .end(function(err, res){
                // there should be no errors
                should.not.exist(err);
                // there should be a 200 status code
                res.status.should.equal(200);
                // the response should be JSON
                res.type.should.equal('application/json');
                // the JSON response body should have a
                // key-value pair of {"status": "success"}
                res.body.status.should.eql('success');
                // the JSON response body should have a
                // key-value pair of {"data": 1 user object}
                res.body.user.should.include.keys(
                    '_id', 'firstname', 'lastname', 'email'
                );
                done();
            })
    });

    it('should failed at login on /auth/login POST (wrong password)', function(done) {
        chai.request(server)
            .post('/auth/login')
            .send({email: "test@test.ca", password: "incorrect"})
            .end(function(err, res){
                res.status.should.not.equal(200);
                res.type.should.equal('application/json');
                res.body.status.should.eql('failure');
                (res.body.message.includes('Invalid password')).should.be.true;
                done();
            })
    });

    it('should failed at login on /auth/login POST (wrong user)', function(done) {
        chai.request(server)
            .post('/auth/login')
            .send({email: "notexisting@test.ca", password: "incorrect"})
            .end(function(err, res){
                res.status.should.not.equal(200);
                res.type.should.equal('application/json');
                res.body.status.should.eql('failure');
                (res.body.message.includes('not found')).should.be.true;
                done();
            })
    });

    it('should signup on /auth/signup POST ', function(done) {
        chai.request(server)
            .post('/auth/signup')
            .send({"email":"newuser@test.ca","firstname":"Tidiane","lastname":"Seri-Gnoleba","password1":"test","password2":"test"})
            .end(function(err, res){

                // SIGNUP VERIFICATION
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.status.should.eql('success');
                res.body.user.should.include.keys(
                    '_id', 'firstname', 'lastname', 'email'
                );
                User.findOne({ email: 'newuser@test.ca' }, function(err, created){
                    created.email.should.eql("newuser@test.ca");
                });

                // LOGIN VERIFICATION
                chai.request(server)
                    .post('/auth/login')
                    .send({email: "newuser@test.ca", password: "test"})
                    .end(function(error, response){

                        should.not.exist(error);
                        response.status.should.equal(200);
                        done();
                    });
            });
    });

    // it('find a user by username', function (done) {
    //     User.findOne({ firstname: 'firsttest' }, function (err, account) {
    //         account.firstname.should.eql('firsttest');
    //         console.log("   username: ", account.firstname);
    //         done();
    //     });
    // });

    it('should list ALL blobs on /blobs GET');
    it('should list a SINGLE blob on /blob/<id> GET');
    it('should add a SINGLE blob on /blobs POST');
    it('should update a SINGLE blob on /blob/<id> PUT');
    it('should delete a SINGLE blob on /blob/<id> DELETE');
});