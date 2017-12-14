"use strict"; 

app.controller("LoginCtrl", function($location, $rootScope, $scope, SpotifyService){
    
    $scope.authenticate = () => {
        SpotifyService.authenticateUser();
    }; 

}); 