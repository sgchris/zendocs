app.controller('HomeController', ['$scope', '$http', function($scope, $http) {
    $scope.posts = {
        resultsPerPage: 2,

        data: [],

        init: function() {
            console.log('init');
            var ref = POSTS
                //.orderByChild('created_at')
                .limitToLast($scope.posts.resultsPerPage);
            ref.once('value', function(snapshot) {
                console.log('snapshot', snapshot.val());
            });
            POSTS.push({
                title: 'title 2',
                content: 'content 2',
                created_at: Math.floor((new Date()).getTime() / 1000), // timestamp
                user: 'sgchris@gmail.com'
            });
        }
    }

    $scope.posts.init();
}]);