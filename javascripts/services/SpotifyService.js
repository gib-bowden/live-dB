"use strict"; 

app.service("SpotifyService", function($q, $http){

    const authenticate = () => {
        return $q((resolve, reject) => {
            $http.get('https://mighty-shelf-28254.herokuapp.com/login').then((results) => {
                console.log("results from /login", results); 
                resolve(); 
            }).then((data) => {
                console.log("results from /authorize", data);
            }).catch((err) => {
                console.log(err);
            });
        });
    }; 
    
    const sendAuthenticationData = (authData) => {
        return $q((resolve, reject) => {
            $http.get(`https://accounts.spotify.com/authorize?${authData}`).then((results) => {
                resolve(results);
            }).catch((err) => {
                console.log(err); 
            });
        });
    };

    return {authenticate}; 
});

 