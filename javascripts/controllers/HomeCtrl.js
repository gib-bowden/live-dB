"use strict";

app.controller("HomeCtrl", function($window, $location, $rootScope, $scope, AuthService, SpotifyService){

    // $scope.spotifyLogin = () => {
    //     SpotifyService.getSpotifyAuthRequest().then((results) => {
    //       console.log(results); 
    //         $window.location.assign(`https://accounts.spotify.com/authorize?${results.data}`)
    //     }).catch((err) => {
    //         console.log("err from spotifyLogin", err);
    //     });
    // };

    $scope.authenticateSpotify = () => {
      SpotifyService.authenticate().then((results) => {
          console.log(results); 
          //authenticateFirebase(results.email, results.password)
      });
  };

      
}); 