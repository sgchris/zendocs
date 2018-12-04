var app = angular.module('zendocs', ['ui.router']);

// routing
app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/home').when('/', '/home').otherwise("home");

    $stateProvider.state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: '/angular/templates/home.html'
    });

    $stateProvider.state('post', {
        url: '/post/:postid',
        controller: 'PostController',
        templateUrl: '/angular/templates/post.html'
    });

    $stateProvider.state('login', {
        url: '/login',
        controller: 'AuthController',
        templateUrl: '/angular/templates/login.html'
    });
    $stateProvider.state('logout', {
        url: '/logout',
        controller: 'AuthController',
        templateUrl: '/angular/templates/empty.html'
    });

    $locationProvider.hashPrefix('!');
}]);

// defaults
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
}]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.user = false;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('authenticated', user);
            $rootScope.$apply(function() {
                $rootScope.user = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous
                };
            });
        } else {
            $rootScope.user = false;
        }
    });
}]);

