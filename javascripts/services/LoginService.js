'use strict';

app.service("LoginService", function(FIREBASE_CONFIG, $q){

    const addFirebaseUser = (email, password) => {
        return $q((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((data) => {
                signInFirebaseUser(email, password)
                .then((data) => {
                    resolve(data.uid)
                })
                .catch((err) => {
                    reject(err);
                })
            })
            .catch(function(error) {
                if (error.code === "auth/email-already-in-use") {
                    signInFirebaseUser(email, password)
                    .then((results) => resolve(results.uid))
                    .catch((error) => {reject(error);});
                }
            });
        })
       
    };

    const signInFirebaseUser = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    return { addFirebaseUser, signInFirebaseUser };
});