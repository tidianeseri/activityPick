'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .run(function($rootScope, $http, $location, $state){
        $rootScope.authenticated = false;
        $rootScope.current_user = "";

        $rootScope.loggedIn = function () {
            $http.post('/auth/isloggedIn').success(function (data) {
                
                if (data.state === 'success') {
                    $rootScope.authenticated = true;
                    $rootScope.current_user = data.user.firstname;
                    $state.transitionTo("main");
                }
                else {
                    $rootScope.authenticated = false;
                    $rootScope.current_user = '';
                    $location.path('/signin');
                }
            });
        };
        $rootScope.loggedIn();

        $rootScope.logout = function () {
            $http.get('/auth/signout');

            $rootScope.authenticated = false;
            $rootScope.current_user = "";

            $location.path('/signin');
        };

        // Checking if authenticated for routes
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !$rootScope.authenticated) {
                // User isn’t authenticated
                $state.transitionTo("signin");
                event.preventDefault();
            }
        });
    })
    .controller('AuthCtrl', function ($scope, $rootScope, $http, $location) {

        var user, auth;

        auth = this;
        auth.user = user = {};

        // Signup submit
        auth.submit = function () {
            if (
                !user.firstname ||
                !user.lastname ||
                !user.email ||
                !user.password1 ||
                !user.password2
            ) {
                alert('Please fill out all form fields.');
                return false;
            }

            if (user.password1 !== user.password2) {
                alert('Passwords must match.');
                return false;
            }

            $http.post('/auth/signup', user)
                .success(function(data){
                    $rootScope.authenticated = true;
                    $rootScope.current_user = data.user.firstname;
                    $location.path('/');
                })
                .error(function(err){
                    console.log(err);
                });
        };
        
        // Login submit
        auth.login = function() {
            $http.post('/auth/login', user)
            .success(function(data){
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.firstname;
                
                $location.path('/');
            })
            .error(function(err){
                console.log(err);
            });
        }

        // Login submit
        auth.signin = function(the_user) {
            user = the_user;
            auth.login();
        }
    });
