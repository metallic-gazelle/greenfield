'use strict';
var home = angular.module('jibe.home', []);

home.controller('HomeCtrl', function ($scope, $window) {
	$scope.id = JSON.parse($window.localStorage.getItem('com.jibe-fb')).id;

});
