"use strict";

let isAuth = (AuthService) => new Promise ((resolve, reject) => {
    if(AuthService.isAuthenticated()){
      resolve();
    } else {
      reject();
    }
});

app.run(function($location, $rootScope, FIREBASE_CONFIG, AuthService){
    firebase.initializeApp(FIREBASE_CONFIG);

    //watch method that fires on change of a route.  3 inputs. 
    //event is a change event
    //currRoute is information about your current route
    //prevRoute is information about the route you came from
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
        // checks to see if there is a current user
        var logged = AuthService.isAuthenticated();
    
        var appTo;
    
        // to keep error from being thrown on page refresh
        if (currRoute.originalPath) {
          // check if the user is going to the auth page = currRoute.originalPath
          // if user is on auth page then appTo is true
          // if it finds something other than /auth it return a -1 and -1!==-1 so resolves to false
          appTo = currRoute.originalPath.indexOf('/login') !== -1;
        }
    
        //if not on /auth page AND not logged in redirect to /auth
        if (!appTo && !logged) {
          event.preventDefault();
          $location.path('/login');
        }

        $rootScope.prevRoute = prevRoute; 
      });



}); 

app.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when("/login", {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when("/home", {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        // .when("/", {
        //     templateUrl: 'partials/redirect.html',
        //     controller: 'RedirectCtrl'
        // })
        .when("/search", {
            templateUrl: 'partials/search.html',
            controller: 'SearchCtrl'
        })
        .when("/upcoming", {
            templateUrl: 'partials/upcoming.html',
            controller: 'UpcomingCtrl'
        })
        .when("/attended", {
            templateUrl: 'partials/attended.html',
            controller: 'AttendedCtrl'
        })

        // $locationProvider.html5Mode({
        //     enabled: false,
        //     requireBase: true
        //   });
}); 