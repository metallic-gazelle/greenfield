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
      fbAuthService.useFacebook('/api/users/login', function(resp){
        console.log("-------> HERE I AM!!");
        deferred.resolve(resp);
      });
      return deferred.promise;
    };

    waitForLogin()
      // After login, store token we get back in localStorage
      .then(function (token){
        console.log("Response from backend: ", token);
        $window.localStorage.setItem('com.jibe-fb', JSON.stringify(token));
        $location.path('/home');
      });
  };

  $scope.fbSignUp = function() {
    // Return a promise that waits for signup process to complete
    var waitForSignup = function() {
      var deferred = $q.defer();
      fbAuthService.useFacebook('/api/users/signup', function(resp){
        deferred.resolve(resp);
      });
      return deferred.promise;
    };
    waitForSignup()
      // After login, store token we get back in localStorage
      .then(function (token){
        console.log("Response from backend: ", token);
        $window.localStorage.setItem('com.jibe-fb', JSON.stringify(token));
        $location.path('/home');
      });
  };

  $scope.fbLogOut = function(){
    fbAuthService.logout();
  };

});
