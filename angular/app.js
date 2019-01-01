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
    });
    $stateProvider.state('post.get', {
        url: '/get/:postid',
        controller: 'PostController',
        templateUrl: '/angular/templates/post.html'
    });
    $stateProvider.state('post.new', {
        url: '/new',
        controller: 'PostController',
        templateUrl: '/angular/templates/post-form.html'
    });
    $stateProvider.state('post.update', {
        url: '/update/:postid',
        controller: 'PostController',
        templateUrl: '/angular/templates/post-form.html'
    });

    // USERS
    $stateProvider.state('user', {
        url: '/user',
    });
    $stateProvider.state('user.profile', {
        url: '/profile',
        controller: 'AuthController',
        templateUrl: '/angular/templates/profile.html'
    });
    $stateProvider.state('user.signup', {
        url: '/signup',
        controller: 'AuthController',
        templateUrl: '/angular/templates/profile.html'
    });
    $stateProvider.state('user.login', {
        url: '/login',
        controller: 'AuthController',
        templateUrl: '/angular/templates/profile.html'
    });
    $stateProvider.state('user.logout', {
        url: '/logout',
        controller: 'AuthController',
        templateUrl: '/angular/templates/profile.html'
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

    $rootScope.downloadDbInProgress = false;
    $rootScope.downloadDb = function($event) {
        $event.preventDefault();

        $rootScope.downloadDbInProgress = true;
        firebase.database().ref().child('posts').once('value').then(function(snap) {
            downloadStringAsFile('zendocs.json', JSON.stringify(snap.val(), null, 4));
        }).finally(function() {
            $rootScope.safeApply(function() {
                $rootScope.downloadDbInProgress = false;
            });
        });
    };

    // watch the "auth" status
    firebase.auth().onAuthStateChanged(function (user) {
        $rootScope.safeApply(function() {
            $rootScope.user = user || false;
        });
    });

    // save state name in the rootScope
    $transitions.onSuccess({}, function(evt) {
        $rootScope.currentState = evt.to().name;
    });
}]);

