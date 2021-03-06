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
                    return {pageName: 'Login', buttonCaption: 'Login'};
                case 'user.signup': 
                    return {pageName: 'Sign up', buttonCaption: 'Sign up'};
                default: 
                    return {pageName: 'Profile', buttonCaption: 'Update profile'};
            }
        }
    };

    $scope.methods = {
        inProgress: false,
        signup: function() {
            var newUser = null;
            var fullname = $scope.formData.fullname;
            var email = $scope.formData.email;
            var password = $scope.formData.password;

            $scope.methods.inProgress = true;
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
                    }).finally(function() {
                        $scope.safeApply(function() {
                            $scope.methods.inProgress = false;
                        });
                    });
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
    
                    console.error('Authenticate new user error', errorMessage);
                    ZNotif('Authenticate new user error', errorMessage, 'error');

                    $scope.safeApply(function() {
                        $scope.methods.inProgress = false;
                    });
                });
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                console.error('Create new user error', errorMessage);
                ZNotif('Create new user error', errorMessage, 'error');

                $scope.safeApply(function() {
                    $scope.methods.inProgress = false;
                });
            });
        },
        updateProfile: function() {
            var user = firebase.auth().currentUser;
            if (user) {
                var fullname = $scope.formData.fullname;
                $scope.methods.inProgress = true;
                user.updateProfile({
                    displayName: fullname,
                    //photoURL: "https://example.com/jane-q-user/profile.jpg"
                }).then(function() {
                    // Update successful.
                    ZNotif('Profile', 'Your profile updated successfully');

                    // update password
                    if ($scope.formData.password.length > 0) {
                        $scope.methods.inProgress = true;
                        user.updatePassword($scope.formData.password).then(function() {
                            ZNotif('Password update', 'Password updated successfully. Please re-login');

                            // logout
                            $state.go('user.logout', {}, {reload:true});
                        }).catch(function(error) {
                            console.error('Password update error', error);
                            ZNotif('Password update error', error.message, 'error');
                        }).finally(function() {
                            $scope.safeApply(function() {
                                $scope.methods.inProgress = false;
                            });
                        });
                    }
    
                }).catch(function(error) {
                    console.error('Profile update error', error);
                    ZNotif('Profile update error', error.message, 'error');
                }).finally(function() {
                    $scope.safeApply(function() {
                        $scope.methods.inProgress = false;
                    });
                });
            } else {
                ZNotif('Profile update', 'Please re-login to update the profile', 'error');
            }
        },
        login: function() {
            $scope.methods.inProgress = true;
            firebase.auth().signInWithEmailAndPassword($scope.formData.email, $scope.formData.password).then(function() {
                $state.go('home', {}, {reload:true});
            }).catch(function(error) {
                console.error('Authentication error', error.message);
                ZNotif('Authentication error', error.message, 'error');
                $scope.safeApply(function() {
                    $scope.formData.errorMessage = error.message;
                });
            }).finally(function() {
                $scope.safeApply(function() {
                    $scope.methods.inProgress = false;
                });
            });
        },

        logout: function() {
            if (firebase.auth().currentUser) {
                $scope.methods.inProgress = true;
                firebase.auth().signOut().then(function() {
                    $state.go('home', {}, {reload:true});
                }).catch(function(error) {
                    console.error('cannot log out', error.message);
                    ZNotif('cannot log out', error.message);
                    // An error happened.
                }).finally(function() {
                    $scope.safeApply(function() {
                        $scope.methods.inProgress = false;
                    });
                });
            } else {
                $state.go('home', {}, {reload:true});
            }
        },

        resetPassword: function() {
            var user = firebase.auth().currentUser;
            if (user) {
                $scope.methods.inProgress = true;
                firebase.auth().sendPasswordResetEmail(user.email).then(function() {
                    ZNotif('Reset password', 'Reset password email has been sent. Please check your email');
                }).catch(function(error) {
                    console.error('Cannot send reset password email', error.message);
                    ZNotif('Cannot send reset password email', error.message);
                }).finally(function() {
                    $scope.safeApply(function() {
                        $scope.methods.inProgress = false;
                    });
                });
            } else {
                console.error('Cannot reset password. No authenticated user');
            }
        },

        // general submit button
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
        $scope.methods.logout();
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