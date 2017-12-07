"use strict"; 

app.service("SongKickService", function($http, $q, SONGKICK_KEY){

//ARTISTS

    const getArtists = (query) => {
        return $q((resolve, reject) => {
            $http.get(`http://api.songkick.com/api/3.0/search/artists.json?apikey=${SONGKICK_KEY}&query=${query}`).then((results) => {
                resolve(results.data.resultsPage.results.artist);
            }).catch((error) => {
                reject(error); 
            });
        });
    };

    const getConcertsByArtistId = (artistId, startDate, endDate, pageNumber) => {
        let pageNumberFilter = (pageNumber) ? `&page=${pageNumber}` : ""; 
        let startDateFilter = (startDate) ? `&min_date=${startDate}` : ""; 
        let endDateFilter = (endDate) ? `&max_date=${endDate}` : ""; 
        return $q((resolve, reject) => {
            $http.get(`http://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=${SONGKICK_KEY}${startDateFilter}${endDateFilter}${pageNumberFilter}`).then((results) => {
                resolve(results.data.resultsPage.results.event);
            }).catch((error) => {
                reject(error); 
            });
        });
    };


//CITIES

    const getBestMetroResult = (cityQuery, countryCode) => {
        return $q((resolve, reject) => {
            let bestResult = {}; 
            $http.get(`http://api.songkick.com/api/3.0/search/locations.json?apikey=${SONGKICK_KEY}&query=${cityQuery}`).then((results) => {
                bestResult = results.data.resultsPage.results.location.find((location) => {
                    return location.city.country.displayName == countryCode;
                });            
                resolve(bestResult);
            }).catch((error) => {
                reject(error); 
            });
        });
    };

    const getConcertsByMetroId = (metroId, startDate, endDate, pageNumber) => {
        let pageNumberFilter = (pageNumber) ? `&page=${pageNumber}` : ""; 
        let startDateFilter = (startDate) ? `&min_date=${startDate}` : ""; 
        let endDateFilter = (endDate) ? `&max_date=${endDate}` : ""; 
        return $q((resolve, reject) => {
            $http.get(`http://api.songkick.com/api/3.0/metro_areas/${metroId}/calendar.json?apikey=${SONGKICK_KEY}${startDateFilter}${endDateFilter}${pageNumberFilter}`).then((results) => {
                resolve(results.data.resultsPage.results.event);
            }).catch((error) => {
                reject(error); 
            });
        });        
    } 





    return {getArtists, getConcertsByArtistId, getBestMetroResult, getConcertsByMetroId}; 
});