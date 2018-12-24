app.controller('SearchController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.search = {
        string: '',

        submit: function() {
            $rootScope.$broadcast('searchStringChanged', {
                string: $scope.search.string
            });
        }
    };
}]);