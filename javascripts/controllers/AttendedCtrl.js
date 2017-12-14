
"use strict"; 

app.controller("AttendedCtrl", function($location, $rootScope, $scope, moment, DatabaseService){

    const getAttendedConcerts = () => {
        DatabaseService.getConcerts($rootScope.uid).then((results) => {
            let attendedConcerts = results.filter((concert) => {
                return moment(concert.datetime) <= moment(); 
            });
            $scope.concerts = attendedConcerts; 
        }).catch((err) => {
            console.log(err);
        });
    };


    getAttendedConcerts(); 

    $scope.deleteConcert = (concert) => {
        DatabaseService.deleteConcert(concert.id).then(() => {
            getAttendedConcerts(); 
        });
    };


    $scope.toggleStatus = (concert) => {
        let newStatus = (concert.status === "going") ? "maybe" : "going";
        concert.status = newStatus;
        delete concert.$$hashKey;
        DatabaseService.updateConcert(concert); 
    };


}); 