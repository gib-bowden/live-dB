
"use strict"; 

app.controller("UpcomingCtrl", function($location, $rootScope, $scope, moment, DatabaseService){

    const getUpcomingConcerts = () => {
        DatabaseService.getConcerts($rootScope.uid).then((results) => {
            console.log(results);
            let upcomingConcerts = results.filter((concert) => {
                return moment(concert.datetime) > moment(); 
            });
            $scope.concerts = upcomingConcerts; 
        }).catch((err) => {
            console.log(err);
        });
    };


    getUpcomingConcerts(); 

    $scope.deleteConcert = (concert) => {
        DatabaseService.deleteConcert(concert.id).then(() => {
            getUpcomingConcerts(); 
        });
    };


    $scope.toggleStatus = (concert) => {
        let newStatus = (concert.status === "going") ? "maybe" : "going";
        concert.status = newStatus;
        delete concert.$$hashKey;
        DatabaseService.updateConcert(concert); 
    };


}); 