app.controller('HomeController', ['$scope', '$http', function($scope, $http) {

    $scope.posts = {
        // paging section
        offset: 0,
        resultsPerPage: 20,

        // "false" is to determine the initial state
        data: false,

        load: function() {
            var ref = POSTS
                .orderByChild('created_at')
                .limitToLast($scope.posts.resultsPerPage + ($scope.posts.resultsPerPage * $scope.posts.offset));
            // TODO: add paging (add offset)
            ref.once('value', function(snapshot) {
                var postsList = snapshot.val();
                
                // leave only the first `resultsPerPage` posts
                if (postsList && postsList.length > $scope.posts.resultsPerPage) {
                    postsList.splice(
                        $scope.posts.resultsPerPage, 
                        postsList.length - $scope.posts.resultsPerPage
                    );
                }

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

    $scope.posts.load();
}]);