"use strict"; 

app.controller("LoginCtrl", function($location, $rootScope, $scope, AuthService){

    let email = 'gibbowden@gmail.com';
    let password = 'password123'; 

    $scope.authenticate = () => {
        if (!$rootScope.uid) {
            AuthService.createUser(email, password).then((result) => {
                $rootScope.uid = result.uid; 
                console.log("new user created")
                $scope.$apply(() => {
                    $location.url("/upcoming"); 
                });            
            }).catch((err) =>{
                if (err.code === "auth/email-already-in-use") {
                    AuthService.authenticateUserToFirebase(email, password).then((result) => {
                        $rootScope.uid = result.uid;
                        $scope.$apply(() => {
                            $location.url("/upcoming"); 
                        });
                    });
                } else {
                    console.log(err); 
                }
            })
        } else {
            $location.path(`/login`);
        }
    };        

}); 