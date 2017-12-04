"use strict"; 

app.service("ShowService", function($http, $q){

    const getArtistShows = (artistName) => {
        return $q((resolve, reject) => {
            $http.get(`https://rest.bandsintown.com/artists/${artistName}/events?app_id=live-dB`).then((results) => {
                resolve(results.data);
            }).catch((error) => {
                reject(error); 
            });
        });
    };



    return {getArtistShows}; 
});