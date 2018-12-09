app.controller('AuthController', ['$scope', '$rootScope', '$http', '$state', 'ZNotif', 
function($scope, $rootScope, $http, $state, ZNotif) {

    $scope.formData = {
        email: '',
        password: '',
        fullname: '',

        errorMessage: '',

        init: function() {
            if ($state.current.name == 'user.profile') {
                $scope.formData.email = $scope.user.email;
                $scope.formData.fullname = $scope.user.displayName;
            }
        }
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
            var newUser = null;
            var fullname = $scope.formData.fullname;
            var email = $scope.formData.email;
            var password = $scope.formData.password;

            firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
                firebase.auth().signInWithEmailAndPassword(email, password).then(function(res) {
                    newUser = res.user;

                    newUser.updateProfile({
                        displayName: fullname
                    }).then(function(res) {
                        ZNotif('Profile', 'Profile updated successfully');
                    }).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
        
                        console.error('Update user profile error', errorMessage);
                        ZNotif('Update user profile error', errorMessage, 'error');
                    });
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
    
                    console.error('Authenticate new user error', errorMessage);
                    ZNotif('Authenticate new user error', errorMessage, 'error');
                });
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                console.error('Create new user error', errorMessage);
                ZNotif('Create new user error', errorMessage, 'error');
            });
        },
        updateProfile: function() {
            var user = firebase.auth().user;

            if (user) {
                var fullname = $scope.formData.fullname;
                var email = $scope.formData.email;
                var password = $scope.formData.password;
                
                user.updateProfile({
                    displayName: $scope.formData.fullname,
                    //photoURL: "https://example.com/jane-q-user/profile.jpg"
                }).then(function() {
                    ZNotif('Profile', 'Your profile updated successfully');
                    // Update successful.
                }).catch(function(error) {
                    ZNotif('Profile', error.message, 'error');
                });

            }
        },
        login: function() {
            firebase.auth().signInWithEmailAndPassword($scope.formData.email, $scope.formData.password)
            .then(function() {
                $state.go('home');
            })
            .catch(function(error) {
                ZNotif('Authentication error', error.message, 'error');
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

    /////////////////////////////////////////////// initial script /////////////////////

    // check if current state is LOGOUT
    if ($state.current.name == 'user.logout') {
        $scope.methods.logout().then(function() {
            $scope.$apply(function() {
                $state.go('home');
            });
        });
    }

    // watch rootScope user (when auth state changes)
    $scope.$watch('$root.user', function() {
        $scope.user = $rootScope.user;

        // load user's data into the form (for "profile" page)
        $scope.formData.init();
    });

    // load 
    $scope.formData.init();
}]);