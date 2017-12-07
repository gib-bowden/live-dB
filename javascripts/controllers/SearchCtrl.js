"use strict"; 

app.controller("SearchCtrl", function($location, $rootScope, $scope, SongKickService){

//takes the artist search box value via kepress (enter) event
//calls the getArtist request 
//returns the best match (first result)

 $scope.enterPushArtistSearch = (e) => {
     if (e.keyCode === 13) {
        SongKickService.getArtists(e.target.value).then((results) => {
            let bestResult = results[0]
            console.log(bestResult);
            getArtistConcerts(bestResult.id, `2017-12-20`, `2017-12-25`, '1'); 
        }).catch((err) => {
            console.log(err); 
        });
     };
 }; 
 
//takes a artistId (required), start date (optional), end date (optional), and page number (optional)
//calls the getConcertsByMetroId function from the service
//sets the artist scope variable

 const getArtistConcerts = (artistId, startDate, endDate, pageNumber) => {
     SongKickService.getConcertsByArtistId(artistId, startDate, endDate, pageNumber).then((results) => {
         console.log(results); 
     })
 }

// takes the city search box value via kepress (enter) event
// calls the getBestMetroResult area request and specifies 'US' as the country
// sets the scope metro area variable
// passes the metroId to the getUsMetroConcerts function

 const getUsMetroSearchResult = (query) => {
     SongKickService.getBestMetroResult(query, 'US').then((result) => {
         console.log(result);
         getUsMetroConcerts(result.metroArea.id, `2017-12-20`, `2018-12-25`, '10');
     });
 };

 //takes a metroId (required), start date (optional), end date (optional), and page number (optional)
 //calls the getConcertsByMetroId function from the service
 //sets the metro area concerts scope variable
 const getUsMetroConcerts = (metroId, startDate, endDate, pageNumber) => {
     SongKickService.getConcertsByMetroId(metroId, startDate, endDate, pageNumber).then((results) => {
         console.log(results); 
     });
 };

 getUsMetroSearchResult("Nashville");

}); 