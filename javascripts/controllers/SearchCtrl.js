"use strict"; 

app.controller("SearchCtrl", function($location, $rootScope, $scope, DatabaseService, SongKickService){


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

    const matchQueriedArtist = (concert) => {
        let artistMatch = concert.performance.filter((act) => {
            return act.artist.id === concert.queriedArtistId
        });
        return artistMatch[0].displayName
    }

    const buildSavableConcertObject = (concert) => {
        let savableConcertObject = {
            concertId: concert.id,
            concertName: concert.displayName,
            artistName: (isArtistSearch) ? matchQueriedArtist(concert) : NEED, 
            artistId: concert.queriedArtistId,
            city: concert.venue.metroArea.displayName,
            state: concert.venue.metroArea.state.displayName,
            venue: concert.venue.displayName,
            datetime: concert.start.datetime,
            rating: null,
            notes: null,
            haveTix: null,
            status: null,
            concertUri: concert.uri,
            uid: $rootScope.uid
        };
        return savableConcertObject; 
    };


    $scope.search = (queryObject, pageNumber) => {
        if (queryObject.artist) {
            getArtistConcerts(queryObject.artist, queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber)
        } else {
            getUsMetroConcerts(queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber)
        }
    }; 

    $scope.saveConcert = (concert) => {
        let savableConcert = buildSavableConcertObject(concert)
        DatabaseService.saveConcert(savableConcert).then((result) => {
            console.log(result); 
        }).catch((err) => {
            console.log(err); 
        });
    };


}); 