app.controller('AuthController', ['$scope', '$http', '$state', function($scope, $http, $state) {

    $scope.formData = {
        email: '',
        password: '',
        fullname: '',

        errorMessage: ''
    };

    $scope.ui = {
        getPageName: function() {
            switch($scope.currentState) {
                case 'user.login': 
                    return 'Login';
                case 'user.signup': 
                    return 'Sign up';                    
                default: 
                    return 'Profile';
            }
        }
    }

    $scope.methods = {
        signup: function() {
            firebase.auth().createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
        },
        updateProfile: function() {
            var user = firebase.auth().user;
            if (user) {
                user.updateProfile({
                    displayName: $scope.formData.fullname,
                    //photoURL: "https://example.com/jane-q-user/profile.jpg"
                }).then(function() {
                    // Update successful.
                }).catch(function(error) {
                    // An error happened.
                });

                /*
                firebase.auth().createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                });
                */
            }
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
            var promise = firebase.auth().signOut();
            
            promise.then(function() {
                // Sign-out successful.
            }).catch(function(error) {
                // An error happened.
            });

            return promise;
        },

        // general submit buton
        submit: function() {
            switch($scope.currentState) {
                case 'user.login': 
                    return $scope.methods.login();
                case 'user.signup': 
                    return $scope.methods.signup();       
                case 'user.profile': 
                    return $scope.methods.updateProfile();       
                default: 
                    return false;
            }
        }
    };

    // check current state
    if ($state.current.name == 'logout') {
        $scope.methods.logout().then(function() {
            $scope.$apply(function() {
                $state.go('home');
            });
        });
    }

}]);