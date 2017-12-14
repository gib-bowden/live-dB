"use strict"; 

app.controller("SearchCtrl", function($location, $rootScope, $scope, DatabaseService, SongKickService, SpotifyService){


    const getArtistConcerts = (artist, city, startDate, endDate, pageNumber) => {
        $scope.artistsConcerts = []; 
        SongKickService.getArtists(artist).then((results) => {
            if (results) {
                return SongKickService.getConcertsByArtistId(results[0].id, startDate, endDate, pageNumber);
            }            
        }).then((results) => {
            if (city && results) {
                let cityResults = filterArtistConcertsByCity(city, results)
                if (cityResults.length) {
                    if ($scope.spotifySearch) {
                        $scope.artistsConcerts.push(buildArtistConcertObject(artist, cityResults)); 
                    } else {
                        $scope.concerts = cityResults;
                    }     
                }           
            } else if (results) {
                if ($scope.spotifySearch) {
                    $scope.artistsConcerts.push(buildArtistConcertObject(artist, results)); 
                } else {
                    $scope.concerts = results;
                }                
            }
        }).catch((err)=> {
            console.log(err); 
        });
    };
    
    const buildArtistConcertObject = (artist, results) => {
        let artistConcertObject = {
            name: artist,
            concerts: results
        };
        return artistConcertObject;
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
            state: concert.venue.metroArea.state.displayName,
            venue: concert.venue.displayName,
            datetime: concert.start.datetime,
            rating: null,
            notes: null,
            haveTix: null,
            status: "going",
            concertUri: concert.uri,
            uid: $rootScope.uid
        };
        return savableConcertObject; 
    };

    const getUniqueArtists = (tracks) => {
        let allArtists = [];
        tracks.forEach((track) => {
            allArtists.push(track.track.artists[0].name);
        });
        let uniqueArtist = [...new Set(allArtists)];
        return uniqueArtist; 
    };

    const getSavedConcertIds = () => {
        $scope.savedConcertIds = [];
        DatabaseService.getConcerts($rootScope.uid).then((results) => {
            results.forEach((result) => {
                let object = {}
                object.concertId = result.concertId;
                object.databaseId = result.id
                $scope.savedConcertIds.push(object);
            })
        })
    };

    getSavedConcertIds(); 

    const clearScope = () => {
        $scope.artistConcerts = null;
        $scope.concerts = null;
        $scope.playlists = null;
        $scope.spotifySearch = null; 
    };


    $scope.search = (queryObject, pageNumber) => {
        clearScope(); 
        if (queryObject.artist) {
            $scope.isArtistSearch = true; 
            getArtistConcerts(queryObject.artist, queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber);
        } else {
            $scope.isArtistSearch = false; 
            getUsMetroConcerts(queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber);
        }
    }; 

    $scope.saveConcert = (artistIndex, concertIndex, concert) => {
        let savableConcert = buildSavableConcertObject(concert);
        DatabaseService.saveConcert(savableConcert).then((result) => { 
            getSavedConcertIds(); 
            $scope.artistsConcerts[artistIndex].concerts[concertIndex].databaseId = result.data.name; 
            $scope.artistsConcerts[artistIndex].concerts[concertIndex].saved = true;
        }).catch((err) => {
            console.log(err); 
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

    $scope.getPlaylistsFromSpotify = () => {
        SpotifyService.getSpotifyPlaylists().then((results) => {
            localStorage.setItem("playlists", JSON.stringify(results.data.items));
            $scope.playlists = results.data.items;
            $scope.isSpotifySearch = true; 
        });
    };

    $scope.searchRecentlyPlayed = () => {
        clearScope();
        $scope.spotifySearch = true; 
        SpotifyService.getRecentlyPlayed().then((results) => {
            let tracks = results.data.items;
            let uniqueArtist = getUniqueArtists(tracks); 
            uniqueArtist.forEach((artist) => {
                if ($scope.query) {
                    getArtistConcerts(artist, $scope.query.city, $scope.query.startDate, $scope.query.endDate);
                } else {
                    getArtistConcerts(artist);
                }  
            });
        });
    };

    $scope.searchPlaylist = (playlistUrl) => {
        SpotifyService.getPlaylistTracks(playlistUrl).then((results) => {
            let tracks = results.data.items;
            let uniqueArtists = getUniqueArtists(tracks); 
            clearScope();
            $scope.spotifySearch = true; 
            uniqueArtists.forEach((artist) => {
                if ($scope.query) {
                    getArtistConcerts(artist, $scope.query.city, $scope.query.startDate, $scope.query.endDate);
                } else {
                    getArtistConcerts(artist);
                }                
            });                
        });
    };

    $scope.isSavedConcert = (concertId, artistIndex, concertIndex) => {
        $scope.savedConcertIds.forEach((concert) => {
            if (concert.concertId === concertId) {
                $scope.artistsConcerts[artistIndex].concerts[concertIndex].saved = true;
                $scope.artistsConcerts[artistIndex].concerts[concertIndex].databaseId = concert.databaseId; 
            }
        });
    };

    $scope.deleteSavedConcert = (artistIndex, concertIndex, concertId) => {
        DatabaseService.deleteConcert(concertId);
        getSavedConcertIds(); 
        $scope.artistsConcerts[artistIndex].concerts[concertIndex].saved = false;
    } 

}); 