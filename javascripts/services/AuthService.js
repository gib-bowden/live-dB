"use strict"; 

app.service("AuthService", function($q, $http){



    const isAuthenticated = () => {
        return firebase.auth().currentUser ? true : false;
     };

     const logout = () => {
        firebase.auth().signOut();
     };




    return {authenticateUserToFirebase, createUser, isAuthenticated, logout}; 
});

 