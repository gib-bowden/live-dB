"use strict"; 

app.controller("NavCtrl", function($location, $rootScope, $scope, $window, AuthService, CityService, ShowService){

    $scope.logoutUser = () => {
        delete $rootScope.uid; 
        $window.localStorage.clear(); 
        AuthService.logout(); 
        $location.path('/login'); 
    };
    

    $rootScope.searchTextNav = {
        text: ""
    };  

        //TEST CALL USING Youi Zouma
        ShowService.getArtistShows("Oasis").then((data) => {
            console.log(data); 
        }).catch((error) => {
            console.log(error);
        });

        CityService.getCityPredictions("Nashv").then((data) => {
            console.log(data);
        }).catch((err) =>{
            console.log(err);
        });
});