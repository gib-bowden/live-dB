"use strict"; 

app.controller("LoginCtrl", function($location, $rootScope, $scope, AuthService){
    $scope.authenticate = () => {
        if (!$rootScope.uid) {
            AuthService.authenticateGoogle().then((result) => {
                $rootScope.uid = result.user.uid; 
                $scope.$apply(() => {
                    $location.url("/home"); 
                });            
            }).catch((err) =>{
                console.log(err); 
            });
        } else {
            $location.path(`/login`);
        }
    };        

}); 