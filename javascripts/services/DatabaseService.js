"use strict"; 

app.service("DatabaseService", function($q, $http, FIREBASE_CONFIG){

    const getConcerts = (userUid) => {
        let concerts = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/concerts.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbConcerts = results.data;
                Object.keys(fbConcerts).forEach((key) => {
                    fbConcerts[key].id = key;
                    concerts.push(fbConcerts[key]);                   
                });  
                resolve(concerts); 
            }).catch((err) => {
                console.log(err);
            });
        });
    };

    const saveConcert = (concert) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/concerts.json`, JSON.stringify(concert));
    };

    const deleteConcert = (concertId) => {
        return $http.delete(`${FIREBASE_CONFIG.databaseURL}/concerts/${concertId}.json`);
    };

    const updateConcert = (concert) => {
        return $http.put(`${FIREBASE_CONFIG.databaseURL}/concerts/${concert.id}.json`, JSON.stringify(concert));        
    };




    return {getConcerts, saveConcert, deleteConcert, updateConcert}; 
});
