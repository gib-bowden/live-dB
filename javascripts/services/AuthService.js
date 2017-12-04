"use strict"; 

app.service("AuthService", function($q, $http){

    const spotifyLoginOptions = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            origin: '*'
        }
    };



    const authenticateGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    };

    const isAuthenticated = () => {
        return firebase.auth().currentUser ? true : false;
     };

     const logout = () => {
        firebase.auth().signOut();
     };


     const spotifyLogin = () => {
        return $q((resolve, reject) => {
            $http.get('http://localhost:8888/login', spotifyLoginOptions).then((results) => {
                 resolve(results); 
            }).catch((err) => {
                console.log(err);
            });
        });
    };   

    return {spotifyLogin, authenticateGoogle, isAuthenticated, logout}; 
});

