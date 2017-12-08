"use strict"; 

app.controller("SearchCtrl", function($location, $rootScope, $scope, SongKickService){


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