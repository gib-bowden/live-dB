
"use strict"; 

app.controller("DetailCtrl", function($location, $rootScope, $scope, moment, DatabaseService){

    $scope.updateTicketStatus = (concert) => {
        delete concert.$$hashKey; 
        DatabaseService.updateConcert(concert);
    };

    $scope.cancel = function () {
        $scope.$dismiss('closed');
    };

    $scope.starChange = (event, concert) => {
        if (event.rating) {
            concert.rating = event.rating;
            delete concert.$$hashKey;
            DatabaseService.updateConcert(concert).then(() => {
            }).catch((err) => {
                console.log(err);
            });
        }
    };

    $scope.save = (concert) => {
        delete concert.$$hashKey;
        DatabaseService.updateConcert(concert).then(() => {
            $scope.$dismiss('saved');
        }).catch((err) => {
            console.log(err);
        });
    };

    
}); 