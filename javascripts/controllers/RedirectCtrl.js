"use strict";

app.controller("RedirectCtrl", function($http, $routeParams){


    const spotifySetToken = () => {
        console.log($routeParams.success); 
        $http.get(`https://mighty-shelf-28254.herokuapp.com/redirecturi${$routeParams.success}`).then((results) => {
            console.log(results);
        }).catch((err) => {
            console.log(err);
        });
    };

    spotifySetToken(); 

      
}); 