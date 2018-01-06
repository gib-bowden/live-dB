"use strict"; 

app.controller("SearchCtrl", function($location, $rootScope, $scope, DatabaseService, SongKickService, SpotifyService){


    const getArtistConcerts = (artist, city, startDate, endDate, pageNumber, artistHref) => {
        $scope.artistsConcerts = []; 
        SongKickService.getArtists(artist).then((results) => {
            if (results) {
                return SongKickService.getConcertsByArtistId(results[0].id, startDate, endDate, pageNumber);
            }            
        }).then((results) => {
            if (city && results) {
                let cityResults = filterArtistConcertsByCity(city, results);
                if (cityResults.length) {
                    if ($scope.isSpotifySearch) {
                        buildArtistConcertObject(artist, cityResults, artistHref); 
                    } else {
                        $scope.concerts = cityResults;
                    }     
                }           
            } else if (results) {
                if ($scope.isSpotifySearch) {
                    buildArtistConcertObject(artist, results, artistHref); 
                } else {
                    $scope.concerts = results;
                }                
            }
        }).catch((err)=> {
            console.log(err); 
        });
    };
    
    const buildArtistConcertObject = (artist, concerts, artistHref) => {
        $scope.artistsConcerts = []; 
        SpotifyService.getArtist(artistHref).then((results) => {
            let artistConcertObject = {
                name: artist,
                concerts: concerts,
                imageUrl: results.data.images[0].url,
                spotifyLink:results.data.external_urls.spotify
            };
            $scope.artistsConcerts.push(artistConcertObject);
        }).catch((err) => {
            console.log(err);
        });
    };

    const filterArtistConcertsByCity = (cityQuery, concertArr) => {
        let regex = RegExp(`(${cityQuery})`, 'ig');
        let localizedConcerts = concertArr.filter((concert) => {
            return regex.test(concert.location.city);
        });
        return localizedConcerts;
    }; 

    const getUsMetroConcerts = (cityQuery, startDate, endDate, pageNumber) => {
        SongKickService.getBestMetroResult(cityQuery, 'US').then((result) => {
            return SongKickService.getConcertsByMetroId(result.metroArea.id, startDate, endDate, pageNumber);
        }).then((results) => {
            $scope.concerts = results;
        }).catch((err) => {
            console.log("getUsMetroResults error", err); 
        });
    };

    const getQueriedArtist = (concert) => {
        let artistMatch = concert.performance.filter((act) => {
            return act.artist.id === concert.queriedArtistId;
        });
        return artistMatch[0];
    };

    const getHeadlinerForMetroQuery = (concert) => {
        let headliner = concert.performance.filter((act) => {
            return act.billing === "headline";
        });
        return headliner[0];
    };

    const buildSavableConcertObject = (concert) => {
        let savableConcertObject = {
            concertId: concert.id,
            concertName: concert.displayName,
            artistName: ($scope.isArtistSearch) ? getQueriedArtist(concert).displayName : getHeadlinerForMetroQuery(concert).displayName, 
            artistId: ($scope.isArtistSearch) ? concert.queriedArtistId : getHeadlinerForMetroQuery(concert).id,
            city: concert.venue.metroArea.displayName,
            state: (concert.venue.metroArea.state) ? concert.venue.metroArea.state.displayName : null, 
            country: concert.venue.metroArea.country.displayName,
            venueName: concert.venue.displayName,
            venueUri: concert.venue.uri,
            datetime: concert.start.datetime,
            rating: null,
            notes: null,
            haveTix: null,
            concertUri: concert.uri,
            uid: $rootScope.uid
        };
        return savableConcertObject; 
    };

    const getUniqueArtists = (tracks) => {
        let allArtists = [];
        let uniqueArtists = []; 
        tracks.forEach((track) => {
            let artistObject = {};
            artistObject.name = track.track.artists[0].name;
            artistObject.href = track.track.artists[0].href;
            allArtists.push(artistObject);
        });
        uniqueArtists = allArtists.filter((artist, index, self) =>
            index === self.findIndex((t) => (
                t.name === artist.name
            ))
        );
        return uniqueArtists; 
    };


    const getSavedConcertIds = () => {
        $scope.savedConcertIds = [];
        DatabaseService.getConcerts($rootScope.uid).then((results) => {
            results.forEach((result) => {
                let object = {};
                object.concertId = result.concertId;
                object.databaseId = result.id;
                $scope.savedConcertIds.push(object);
            });
        });
    };

    getSavedConcertIds(); 


    const clearScope = () => {
        $scope.artistConcerts = null;
        $scope.concerts = null;
        $scope.playlists = null;
        $scope.isSpotifySearch = null; 
    };

    const searchEachArtist = (uniqueArtistsArray) => {
        uniqueArtistsArray.forEach((artist) => {
            if ($scope.query) {
                getArtistConcerts(artist.name, $scope.query.city, $scope.query.startDate, $scope.query.endDate, null, artist.href);
            } else {
                getArtistConcerts(artist.name, null, null, null, null, artist.href);
            }  
        });
    };


    $scope.search = (queryObject, pageNumber) => {
        clearScope(); 
        if (queryObject.artist) {
            $scope.searchParam = queryObject.artist; 
            $scope.isArtistSearch = true; 
            getArtistConcerts(queryObject.artist, queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber);
        } else {
            $scope.searchParam = queryObject.city;
            $scope.isArtistSearch = false; 
            getUsMetroConcerts(queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber);
        }
    }; 

    $scope.saveConcert = (artistIndex, concertIndex, concert) => {
        let savableConcert = buildSavableConcertObject(concert);
        DatabaseService.saveConcert(savableConcert).then((result) => { 
            getSavedConcertIds(); 
            if ($scope.isSpotifySearch) {
                $scope.artistsConcerts[artistIndex].concerts[concertIndex].databaseId = result.data.name; 
                $scope.artistsConcerts[artistIndex].concerts[concertIndex].saved = true;
            } else if (!$scope.isSpotifySearch) {
                $scope.concerts[concertIndex].databaseId = result.data.name; 
                $scope.concerts[concertIndex].saved = true;
            }
        }).catch((err) => {
            console.log(err); 
        });
    };

    $scope.getPlaylistsFromSpotify = () => {
        SpotifyService.getSpotifyPlaylists().then((results) => {
            localStorage.setItem("playlists", JSON.stringify(results.data.items));
            $scope.playlists = results.data.items;
            $scope.isSpotifySearch = true;
            console.log($scope.playlists);
        });
    };

    $scope.getPlaylists = () => {
        clearScope(); 
        if (localStorage.getItem("playlists")) {
            $scope.playlists = JSON.parse(localStorage.getItem("playlists"));
        } else {
            $scope.getPlaylistsFromSpotify();
        }
    };

    $scope.getPlaylists();     

    $scope.searchRecentlyPlayed = () => {
        clearScope();
        $scope.isSpotifySearch = true; 
        SpotifyService.getRecentlyPlayed().then((results) => {
            let tracks = results.data.items;
            let uniqueArtists = getUniqueArtists(tracks); 
            searchEachArtist(uniqueArtists);
        });
    };



    $scope.searchPlaylist = (playlistUrl) => {
        SpotifyService.getPlaylistTracks(playlistUrl).then((results) => {
            let tracks = results.data.items;
            let uniqueArtists = getUniqueArtists(tracks);
            clearScope();
            $scope.isSpotifySearch = true; 
            searchEachArtist(uniqueArtists);              
        });
    };

    $scope.isSavedConcert = (concertId, artistIndex, concertIndex) => {
        $scope.savedConcertIds.forEach((concert) => {
            if (concert.concertId === concertId) {
                if ($scope.isSpotifySearch) {
                    $scope.artistsConcerts[artistIndex].concerts[concertIndex].saved = true;
                    $scope.artistsConcerts[artistIndex].concerts[concertIndex].databaseId = concert.databaseId; 
                } else if (!$scope.isSpotifySearch) {
                    $scope.concerts[concertIndex].saved = true;
                    $scope.concerts[concertIndex].databaseId = concert.databaseId; 
                }                
            }
        });
    };

    $scope.deleteSavedConcert = (artistIndex, concertIndex, concertId) => {
        DatabaseService.deleteConcert(concertId).then(() => {
            if ($scope.isSpotifySearch) {
                getSavedConcertIds(); 
                $scope.artistsConcerts[artistIndex].concerts[concertIndex].saved = false;
            } else if (!$scope.isSpotifySearch) {
                $scope.concerts[concertIndex].saved = false;
            }
        });
    };

    $scope.mouseOver = (event) => {
        console.log(event); 
    }; 

    $scope.mouseLeave = (event) => {
        console.log(event); 
    }; 

}); 