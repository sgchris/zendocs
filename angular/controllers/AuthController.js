app.controller('AuthController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.formData = {
        email: '',
        password: '',

        errorMessage: ''
    };

    $scope.methods = {
        signup: function() {
            firebase.auth().createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
        },
        login: function() {
            firebase.auth().signInWithEmailAndPassword($scope.formData.email, $scope.formData.password).catch(function(error) {
                console.log('error occured', error);
                // Handle Errors here.
                var errorCode = error.code;
                $scope.$apply(function() {
                    $scope.formData.errorMessage = error.message;
                })
            });
        },

        logout: function() {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }).catch(function(error) {
                // An error happened.
            });
        }
    }
}]);