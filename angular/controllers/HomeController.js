app.controller('HomeController', ['$scope', function ($scope) {

    $scope.posts = {
        // paging section
        offset: 0,
        resultsPerPage: 20,

        // "false" is to determine the initial state
        // data is the one displayed on the page
        data: false,
        // "allData" is all the data from the DB (due to firebase substring limitation)
        allData: false,
        lastUpdateTime: 0,
        updateInterval: 10 * 60 * 1000, // update data every 10 minutes

        // take the 
        setData: function () {
            var totalPosts = $scope.posts.allData ? $scope.posts.allData.length : 0;
            if (totalPosts == 0) {
                $scope.posts.data = [];
            } else {
                var initialIndex = totalPosts - ($scope.posts.offset + 1) * $scope.posts.resultsPerPage;
                if (initialIndex < 0) {
                    initialIndex = 0;
                }

                $scope.posts.data = $scope.posts.allData
                    .slice(initialIndex, $scope.posts.resultsPerPage)
                    .reverse();
            }
        },

        load: function () {
            var currentTimestamp = Math.floor((new Date()).getTime() / 1000);
            if (
                $scope.posts.allData === false || 
                $scope.posts.lastUpdateTime === 0 || 
                $scope.posts.lastUpdateTime < currentTimestamp - $scope.posts.updateInterval
            ) {
                var ref = window.POSTS.orderByChild('created_at');
                // TODO: add paging (add offset)
                ref.once('value', function (snapshot) {
                    $scope.posts.allData = Object.values(snapshot.val());
                    $scope.safeApply(function () {
                        $scope.posts.setData();
                    });
                });
            } else {
                $scope.posts.setData();
            }
        }
    };

    $scope.posts.load();
}]);