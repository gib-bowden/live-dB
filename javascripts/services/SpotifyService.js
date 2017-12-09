'use strict';

app.service("SpotifyService", function($http, $window, $rootScope, $location, LoginService){
    let spotifyWindow;

    const getCurrentSpotifyId = () => {
        return localStorage.getItem('spotifyUserId');
    }

    const authenticateUser = () => {
        localStorage.removeItem('spotifyUserId');
        $http.get(`https://mighty-shelf-28254.herokuapp.com/login`)
        .then(( results ) => {
            spotifyWindow = $window.open(results.data, 'spotify', "menubar=1,resizable=1,width=350,height=250");
        }).catch((err) => {
            console.log('error in authenticeUser:', err);
        });
    };

    const closeSpotifyWindow = () => {
        spotifyWindow.close();
    };

    const getSpotifyPlaylists = () => {
        return $http.get(`https://mighty-shelf-28254.herokuapp.com/userPlaylist?user=${getCurrentSpotifyId()}`); 
    };

    firebase.database().ref('userDetails/').on("child_changed" || "child_added", function(snapshot) {
        if (snapshot.val() !== null && !getCurrentSpotifyId()) {
            closeSpotifyWindow();
            const spotifyUserId = snapshot.key;
            console.log(spotifyUserId);
            const userData = snapshot.val();
            localStorage.setItem('spotifyUserId', spotifyUserId);
            LoginService.addFirebaseUser(userData.email, userData.spotifyId).then((uid) => {
                console.log(uid);
                $rootScope.uid = uid; 
                firebase.database().ref('userDetails/' + spotifyUserId).update({'uid': uid});
            })
            $rootScope.$apply(() => {$location.path('/upcoming')});         
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    
    return { authenticateUser, getSpotifyPlaylists, getCurrentSpotifyId };
});