'use strict';

/**
 * @ngdoc function
 * @name clientApp.services
 * @description
 * # services
 * Services of the clientApp
 */

angular.module('clientApp.services', [])
    .factory('activitiesService', function ($resource) {
        return $resource('/api/activities/:id', { id: '@_id' }, {
            'update': {
                method: 'PUT'
            }
        });
    })
    .service('popupService', ['$window', function ($window) {
        this.showPopup = function (message) {
            return $window.confirm(message); //Ask the users if they really want to delete the post entry
        }
    }])
    .factory('AuthService', function ($http, $location) {
        var authService = {};

        authService.authenticated = false;
        authService.current_user = "";

        authService.loggedIn = function () {
            $http.post('/auth/isloggedIn').success(function (data) {
                
                if (data.state === 'success') {
                    authService.authenticated = true;
                    authService.current_user = data.user.firstname;
                    return true;
                }
                else {
                    authService.authenticated = false;
                    authService.current_user = '';
                    return false;
                }
            });
        };
        
        authService.loggedIn();

        authService.logout = function () {
            $http.get('/auth/signout');

            authService.authenticated = false;
            authService.current_user = "";

            $location.path('/signin');
        }

        return authService;
    });