app.controller('HomeController', ['$scope', '$rootScope', function($scope, $rootScope) {

    $scope.posts = {
        // paging section
        offset: 0,
        resultsPerPage: 20,

        searchString: '',

        // filter the data (array of posts), by the 'searchString'
        filterResultsBySearchString: function(data) {
            if (!data || data.length === 0) {
                return [];
            }

            // filter the data if a search string is defined
            if ($scope.posts.searchString.length > 0) {
                var newList = [];

                data.forEach(function(post) {
                    var searchStrings = $scope.posts.searchString.split(/\s+/),
                        itemIsValid = true;

                    // check that all the search strings match the 
                    searchStrings.forEach(function(searchString) {
                        searchString = searchString.toLowerCase();

                        // check if this post matches the current search string
                        // (and all the previous search strings)
                        if (
                            itemIsValid && 
                            post.title.toLowerCase().indexOf(searchString) < 0 &&
                            post.description.toLowerCase().indexOf(searchString) < 0 &&
                            post.content.toLowerCase().indexOf(searchString) < 0
                        ) {
                            itemIsValid = false;
                        }
                    });

                    if (itemIsValid) {
                        newList.push(post);
                    }
                });

                return newList;
            }

            // return the new set
            return data;
        },

        // "false" is to determine the initial state
        // data is the one displayed on the page
        data: false,
        // "allData" is all the data from the DB (due to firebase substring limitation)
        allData: false,
        lastUpdateTime: 0,
        updateInterval: 10 * 60 * 1000, // update data every 10 minutes

        // boolean function that returns whether "next" button should appear,
        // or we're already on the last page
        previousPageLinkShouldAppear: function() {
            var numOfRelevantPosts = $scope.posts.filterResultsBySearchString($scope.posts.allData).length;
            return ($scope.posts.offset + 1) < Math.ceil(numOfRelevantPosts / $scope.posts.resultsPerPage);
        },

        // move to previous page
        previousPage: function() {
            ++$scope.posts.offset;
            $scope.posts.setData();
        },

        nextPage: function() {
            if ($scope.posts.offset > 0) {
                --$scope.posts.offset;
                $scope.posts.setData();
            }
        },

        // set the relevant data for the view
        setData: function () {

            // filter the data
            var postsList = $scope.posts.filterResultsBySearchString($scope.posts.allData);

            // set only the relevant data for the view
            var totalPosts = postsList ? postsList.length : 0;
            if (totalPosts == 0) {
                $scope.posts.data = [];
            } else {
                var initialIndex = totalPosts - ($scope.posts.offset + 1) * $scope.posts.resultsPerPage;
                $scope.posts.data = initialIndex < 0 ? 
                    postsList.slice(0, initialIndex + $scope.posts.resultsPerPage) : 
                    postsList.slice(initialIndex, initialIndex + $scope.posts.resultsPerPage);

                // reverse the data to display in a desc order
                $scope.posts.data = $scope.posts.data.reverse();

            }
        },

        // load data from the server (periodically) and store locally ALL(!) the data
        // we store all the data for the searching purposes (FireBase has limitation
        // to filter results by a search string)
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
                    $scope.safeApply(function () {
                        $scope.posts.lastUpdateTime = currentTimestamp;
                        $scope.posts.allData = Object.values(snapshot.val());
                        $scope.posts.setData();
                    });
                });
            } else {
                $scope.posts.setData();
            }
        }
    };

    $scope.posts.load();

    $scope.$on('searchStringChanged', function(event, obj) {
        $scope.posts.searchString = obj.string;
        $scope.posts.offset = 0;
        $scope.posts.setData();
    });
}]);