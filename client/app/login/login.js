'use strict';
var auth = angular.module('jibe.auth', []);

auth.controller('AuthCtrl', function ($scope, $rootScope, $window, $location, fbAuthService, $q) {

  $scope.loginError = false;
  $scope.loginErrorMessage = '';

  $scope.user = {};

  $scope.redirect = function (path) {
    console.log(path);
    $location.path('/' + path);
  };

  // FACEBOOK AUTHENTICATION
  $scope.fbLogIn = function() {
    // Return a promise that waits for login process to complete
    var waitForLogin = function() {
      var deferred = $q.defer();
      fbAuthService.useFacebook('/api/users/login', function(resp) {
        deferred.resolve(resp);
      });
      return deferred.promise;
    };

    waitForLogin()
      // After login, store token we get back in localStorage
      .then(function (userObj) {
        $window.localStorage.setItem('com.jibe-fb', JSON.stringify(userObj));
        $location.path('/home');
      });
  };


  $scope.fbLogOut = function() {
    fbAuthService.logout();
  };

});
