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

    $stateProvider.state('user', {
        url: '/user',
        controller: 'AuthController',
        templateUrl: '/angular/templates/profile.html'
    });
    $stateProvider.state('user.profile', {
        url: '/profile',
        controller: 'AuthController',
    });
    $stateProvider.state('user.signup', {
        url: '/signup',
        controller: 'AuthController',
    });
    $stateProvider.state('user.login', {
        url: '/login',
        controller: 'AuthController',
    });
    $stateProvider.state('user.logout', {
        url: '/logout',
        controller: 'AuthController',
    });

    $locationProvider.hashPrefix('!');
}]);

// defaults
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
}]);

app.run(['$rootScope', '$transitions', function($rootScope, $transitions) {
    $rootScope.user = false;

    // watch the "auth" status
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

    // save state name in the rootScope
    $transitions.onSuccess({}, function(evt) {
        $rootScope.currentState = evt.to().name;
    });
}]);

