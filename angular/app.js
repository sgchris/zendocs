var app = angular.module('zendocs', ['ui.router']);

// routing
app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: '/angular/templates/home.html'
    });

    $stateProvider.state('404', {
        url: '/404',
        controller: 'Error404Controller',
        templateUrl: '/angular/templates/404.html'
    });

    // POSTS
    $stateProvider.state('post', {
        url: '/post',
        controller: 'PostController'
    });
    $stateProvider.state('post.get', {
        url: '/get/:postid',
        templateUrl: '/angular/templates/post.html'
    });
    $stateProvider.state('post.new', {
        url: '/new',
        templateUrl: '/angular/templates/post-form.html'
    });
    $stateProvider.state('post.update', {
        url: '/update/:postid',
        templateUrl: '/angular/templates/post-form.html'
    });

    // USERS
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

    $urlRouterProvider.when('', '/home').when('/', '/home').otherwise("404");
}]);

// defaults
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
}]);

app.run(['$rootScope', '$transitions', function($rootScope, $transitions) {
    $rootScope.user = false;

    $rootScope.safeApply = function (fn) {
        if (!this || !this.$root) {
            fn();
            return;
        }
        
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    // watch the "auth" status
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $rootScope.$apply(function() {
                $rootScope.user = user;
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

