'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the clientApp
 */

angular.module('clientApp')
    .controller('AllActivitiesCtrl', function ($scope, activitiesService) {
        $scope.activities = activitiesService.query(); //fetch all activities. Issues a GET to /api/movies
    })
    .controller('AddActivityCtrl', function ($scope, $state, activitiesService) {
        $scope.activity = new activitiesService();

        $scope.addActivity = function() {
            $scope.activity.$save(function(){
                // Success callback, redirect to list
                $state.go('activities');
            });
        };
    })
    .controller('ViewActivityCtrl', function ($scope, $stateParams, activitiesService) {
        $scope.activity = activitiesService.get({ id: $stateParams.id });
    })
    .controller('EditActivityCtrl', function ($scope, $state, $stateParams, activitiesService, popupService) {
        $scope.updateActivity = function() {
            $scope.activity.$update(function(){
                $state.go('activities');
            });
        };

        $scope.deleteActivity = function(activity) {
            if (popupService.showPopup('Really delete this?')) {
                activity.$delete();
                $state.go('activities');
            }
        };

        $scope.loadActivity = function() {
            $scope.activity = activitiesService.get({ id: $stateParams.id });
        };

        $scope.loadActivity();
    })
    .controller('PickActivityCtrl', function ($scope, $stateParams, $http) {
        $scope.picked = false;
        $http.get('/api/pickactivities').success(function(data){
            $scope.activity = data;
        })

        $scope.acceptActivity = function() {
            $http.put('/api/pickactivities/accept/'+$scope.activity._id).success(function(data){
                console.log(data);
                $scope.activity = data;
                $scope.picked = true;
            })
        }
    });
