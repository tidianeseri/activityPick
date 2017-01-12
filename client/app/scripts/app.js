'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
    .module('clientApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ui.router',
        'ngSanitize',
        'ngTouch',
        'clientApp.services'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                authenticate: true
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                authenticate: false
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                authenticate: false
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'views/signin.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                authenticate: false
            })
            .state('activities', {
                url: '/activities',
                templateUrl: 'views/activity-all.html',
                controller: 'AllActivitiesCtrl',
                authenticate: true
            })
            .state('addActivity', {
                url: '/activities/add',
                templateUrl: 'views/activity-add.html',
                controller: 'AddActivityCtrl',
                authenticate: true
            })
            .state('viewActivity', {
                url: '/activities/:id/view',
                templateUrl: 'views/activity-view.html',
                controller: 'ViewActivityCtrl',
                authenticate: true
            })
            .state('editActivity', {
                url: '/activities/:id/edit',
                templateUrl: 'views/activity-edit.html',
                controller: 'EditActivityCtrl',
                authenticate: true
            })
            .state('pickActivity', {
                url: '/activities/pick',
                templateUrl: 'views/activity-pick.html',
                controller: 'PickActivityCtrl',
                authenticate: true
            });
    }).run(function($state) {
        $state.go('main'); //make a transition to main state when app starts
    });