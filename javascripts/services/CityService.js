
"use strict"; 

app.service("CityService", function($http, $q, GOOGLE_MAPS_KEY){

    const getCityPredictions = (input) => {
        return $q((resolve, reject) => {
            $http.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${GOOGLE_MAPS_KEY}`).then((results) => {
                resolve(results.predictions);
            }).catch((error) => {
                reject(error); 
            });
        });
    };



    return {getCityPredictions}; 
});











