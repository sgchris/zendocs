app.controller('HomeController', ['$scope', '$http', 'UsersData', function($scope, $http, UsersData) {
    $scope.posts = {
        resultsPerPage: 20,

        usersData: {},

        data: [],

        init: function() {
            var ref = POSTS
                .orderByChild('created_at')
                .limitToLast($scope.posts.resultsPerPage);
            ref.once('value', function(snapshot) {
                var postsList = snapshot.val();
                if (postsList) {
                    Object.keys(postsList).forEach(function(postId) {
                        var postData = postsList[postId];
                        postsList[postId].postid = postId;

                        // post's user ID
                        var uid = postData.uid;
                        
                        // load users data
                        if (!$scope.posts.usersData[uid]) {
                            UsersData(uid, function(uData) {
                                if (!$scope.posts.usersData[uid]) {
                                    $scope.posts.usersData[uid] = uData;
                                }
                            });
                        }
                    });

                    postsList = Object.values(postsList).reverse();
                }

                // set the data locally
                $scope.$apply(function() {
                    $scope.posts.data = postsList;
                    console.log('$scope.posts.data', $scope.posts.data);
                });
            });
        }
    }

    $scope.posts.init();
}]);