"use strict"; 

app.service("AuthService", function($q, $http){


    const createUser = (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password); 
    };

    const authenticateUserToFirebase = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    };


    const isAuthenticated = () => {
        return firebase.auth().currentUser ? true : false;
     };

     const logout = () => {
        firebase.auth().signOut();
     };




    return {authenticateUserToFirebase, createUser, isAuthenticated, logout}; 
});

 