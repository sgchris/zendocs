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

    $locationProvider.hashPrefix('!');
}]);

// defaults
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
}]);

