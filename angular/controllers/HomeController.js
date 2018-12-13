app.controller('HomeController', ['$scope', '$http', function($scope, $http) {

    $scope.posts = {
        // paging section
        offset: 0,
        resultsPerPage: 20,

        // "false" is to determine the initial state
        data: false,

        init: function() {
            var ref = POSTS
                .orderByChild('created_at')
                .limitToLast($scope.posts.resultsPerPage);
            // TODO: add paging (add offset)
            ref.once('value', function(snapshot) {
                var postsList = snapshot.val();

                // add postId to the objects
                if (postsList) {
                    Object.keys(postsList).forEach(function(postId) {
                        postsList[postId].postid = postId;
                    });

                    postsList = Object.values(postsList).reverse();
                }

                // set the data locally
                $scope.$apply(function() {
                    $scope.posts.data = postsList;
                });
            });
        }
    }

    $scope.posts.init();
}]);