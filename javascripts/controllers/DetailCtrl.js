
"use strict"; 

app.controller("DetailCtrl", function($location, $rootScope, $scope, moment, DatabaseService){

    $scope.updateTicketStatus = (concert) => {
        delete concert.$$hashKey; 
        DatabaseService.updateConcert(concert);
    }

    $scope.cancel = function () {
        $scope.$dismiss('closed');
    };

    
}); 