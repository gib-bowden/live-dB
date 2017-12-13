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
                console.log("getArtistConcerts(filtered)", filterArtistConcertsByCity(city, results));
                if ($scope.spotifySearch) {
                    $scope.artistsConcerts.push(buildArtistConcertObject(artist, filterArtistConcertsByCity(city, results))); 
                } else {
                    $scope.concerts = filterArtistConcertsByCity(city, results);
                }                
            } else if (results) {
                if ($scope.spotifySearch) {
                    $scope.artistsConcerts.push(buildArtistConcertObject(artist, results)); 
                } else {
                    $scope.concerts = results;
                }                
            }
            console.log("scope from artist search", $scope);
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
            console.log("getUsMetroResults", results);
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

    const clearSearchResults = () => {
        $scope.artistList = null;
        $scope.artistConcerts = null;
        $scope.concerts = null;
    };

    const clearPlaylists = () => {
        $scope.playlists = null;
    }; 

    $scope.search = (queryObject, pageNumber) => {
        clearSearchResults(); 
        clearPlaylists();
        if (queryObject.artist) {
            $scope.isArtistSearch = true; 
            getArtistConcerts(queryObject.artist, queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber);
        } else {
            $scope.isArtistSearch = false; 
            getUsMetroConcerts(queryObject.city, queryObject.startDate, queryObject.endDate, pageNumber);
        }
    }; 

    $scope.saveConcert = (concert) => {
        let savableConcert = buildSavableConcertObject(concert);
        DatabaseService.saveConcert(savableConcert).then((result) => {
            console.log(result); 
        }).catch((err) => {
            console.log(err); 
        });
    };

    $scope.getPlaylists = () => {
        if (localStorage.getItem("playlists")) {
            $scope.playlists = JSON.parse(localStorage.getItem("playlists"));
        } else {
            $scope.getPlaylistsFromSpotify();
        }
    };

    $scope.getPlaylistsFromSpotify = () => {
        SpotifyService.getSpotifyPlaylists().then((results) => {
            console.log(results.data.items);
            localStorage.setItem("playlists", JSON.stringify(results.data.items));
            $scope.playlists = results.data.items;
            $scope.isSpotifySearch = true; 
        });
    };


    $scope.searchRecentlyPlayed = () => {
        $scope.spotifySearch = true; 
        clearPlaylists(); 
        SpotifyService.getRecentlyPlayed().then((results) => {
            let tracks = results.data.items;
            console.log(tracks);
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
        $scope.spotifySearch = true; 
        SpotifyService.getPlaylistTracks(playlistUrl).then((results) => {
            let tracks = results.data.items;
            clearPlaylists(); 
            console.log(tracks);
            let uniqueArtists = getUniqueArtists(tracks); 
            uniqueArtists.forEach((artist) => {
                if ($scope.query) {
                    getArtistConcerts(artist, $scope.query.city, $scope.query.startDate, $scope.query.endDate);
                } else {
                    getArtistConcerts(artist);
                }                
            });                
        });
    };





}); 