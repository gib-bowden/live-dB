"use strict";

app.controller("HomeCtrl", function($window, $location, $rootScope, $scope, AuthService, SpotifyService){

    $scope.authenticateSpotify = () => {
      SpotifyService.authenticate().then((results) => {
          console.log(results); 
          //authenticateFirebase(results.email, results.password)
      });
  };

      
}); 