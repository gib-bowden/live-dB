"use strict"; 

app.controller("SearchCtrl", function($location, $rootScope, $scope, SongKickService){

//takes the artist search box value via kepress (enter) event
//calls the getArtist request 
//returns the best match (first result)

    // $scope.enterPushArtistSearch = (e) => {
    //     if (e.keyCode === 13) {
    //         SongKickService.getArtists(e.target.value).then((results) => {
    //             let bestResult = results[0]
    //             console.log(bestResult);
    //             getArtistConcerts(bestResult.id, `2017-12-20`, `2017-12-25`, '1'); 
    //         }).catch((err) => {
    //             console.log(err); 
    //         });
    //     };
    // }; 

//takes a artistId (required), start date (optional), end date (optional), and page number (optional)
//calls the getConcertsByMetroId function from the service
//sets the artist scope variable

    const getArtistConcerts = (artist, city, startDate, endDate, pageNumber) => {
        SongKickService.getArtists(artist).then((results) => {
            return SongKickService.getConcertsByArtistId(results[0].id, startDate, endDate, pageNumber)
        }).then((results) => {
            if (city) {
                console.log("getArtistConcerts(filtered)", filterArtistConcertsByCity(city, results));
                $scope.concerts = filterArtistConcertsByCity(city, results);
            } else {
                console.log("getArtistConcerts", results); 
                $scope.concerts = results;
            } 
        }).catch((err)=> {
            console.log(err); 
        });
    };

    const filterArtistConcertsByCity = (cityQuery, concertArr) => {
        let regex = RegExp(`(${cityQuery})`, 'ixg');
        let localizedConcerts = concertArr.filter((concert) => {
            return regex.test(concert.location.city)
        })
        return localizedConcerts;
    }; 


 //takes a metroId (required), start date (optional), end date (optional), and page number (optional)
 //calls the getConcertsByMetroId function from the service
 //sets the metro area concerts scope variable
    const getUsMetroConcerts = (cityQuery, startDate, endDate, pageNumber) => {
        SongKickService.getBestMetroResult(cityQuery, 'US').then((result) => {
            return SongKickService.getConcertsByMetroId(result.metroArea.id, startDate, endDate, pageNumber)
        }).then((results) => {
            console.log("getUsMetroResults", results);
            $scope.concerts = results;
        }).catch((err) => {
            console.log("getUsMetroResults error", err); 
        });
    };


    $scope.search = (searchObject, pageNumber) => {
        if (searchObject.artist) {
            getArtistConcerts(searchObject.artist, searchObject.city, searchObject.startDate, searchObject.endDate, pageNumber)
        } else {
            getUsMetroConcerts(searchObject.city, searchObject.startDate, searchObject.endDate, pageNumber)
        }
    }; 


}); 