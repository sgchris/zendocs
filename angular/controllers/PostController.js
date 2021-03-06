app.controller('PostController', [
    '$scope', '$state', '$rootScope', 'MarkdownEditor', 'ZNotif', 'ModalBox', 
function($scope, $state, $rootScope, MarkdownEditor, ZNotif, ModalBox) {
    $scope.posts = {
        form: {
            inProgress: false,

            postid: '',
            uid: '',
            title: '',
            content: '',
            description: '',
            created_at: 0,
            fullname: '',

            errorMessage: '',

            reset: function() {
                $scope.posts.form.postid = '';
                $scope.posts.form.uid = '';
                $scope.posts.form.title = '';
                $scope.posts.form.content = '';
                $scope.posts.form.description = '';
            },

            getName: function() {
                switch ($state.current.name) {
                    case 'post.new':
                        return 'Add post';
                    case 'post.update':
                        return 'Update post';
                    default:
                        return 'Post';
                }
            }
        },

        add: function(callbackFn) {
            var title = $scope.posts.form.title;
            var description = $scope.posts.form.description;
            var content = MarkdownEditor.val();
            var user = firebase.auth().currentUser;
            if (!user) {
                ZNotif('New post', 'No authenticated user', 'error');
                return false;
            }

            var newPost = firebase.database().ref().child('posts').push();
            newPost.set({
                postid: newPost.key,
                uid: user.uid,
                fullname: user.displayName,

                title: title, 
                content: content,
                description: description,
                created_at: Math.floor((new Date()).getTime() / 1000),
            }, function(err) {
                if (!err) {
                    if (typeof(callbackFn) == 'function') {
                        callbackFn();
                    } else {
                        ZNotif('New post', 'Post added successfully');
                        $state.go('home');
                    }
                }
            });
        },

        update: function() {
            $scope.posts.form.inProgress = true;

            var postid = $scope.posts.form.postid;
            var title = $scope.posts.form.title;
            var description = $scope.posts.form.description;
            var content = MarkdownEditor.val();

            var post = firebase.database().ref().child('posts/' + postid);
            var promise = post.update({
                title: title,
                description: description,
                content: content,
            });
            
            promise.then(function() {
                ZNotif('Post update', 'Post updated successfully');
                $state.go('post.get', {postid: postid});
            }).finally(function() {
                $scope.safeApply(function() {
                    $scope.posts.form.inProgress = false;
                });
            });

            return promise;
        },

        delete: function (postid) {
            ModalBox.confirm('Delete post', 'Are you sure?', function() {
                $scope.posts.form.inProgress = true;
                var post = firebase.database().ref('posts/' + postid).remove().then(function() {
                    $state.go('home');
                    
                    ZNotif('Delete post', 'Deleted successfully');
                }).catch(function(error) {
                    ZNotif('Delete post', error.errorMessage, 'error');
                }).finally(function() {
                    $scope.safeApply(function() {
                        $scope.posts.form.inProgress = false;
                    });
                });
            });
        },

        submit: function() {
            switch ($state.current.name) {
                case 'post.new':
                    return $scope.posts.add();
                case 'post.update':
                    return $scope.posts.update();
                default:
                    return false;
            }
        },

        loadInProgress: false,
        load: function(postid, skipRenderingMDEditor) {
            $scope.posts.loadInProgress = true;
            return firebase.database().ref().child('posts/'+postid).once('value', function(snap) {
                var val = snap.val();
                if (val) {
                    $scope.safeApply(function() {
                        $scope.posts.form.postid = val.postid;
                        $scope.posts.form.uid = val.uid;
                        $scope.posts.form.title = val.title;
                        $scope.posts.form.description = val.description;
                        $scope.posts.form.fullname = val.fullname;
                        $scope.posts.form.created_at = val.created_at;
                        
                        if ($state.current.name == 'post.get') {
                            if (!skipRenderingMDEditor) {
                                MarkdownEditor.renderHtml(val.content, function(renderedHtml) {
                                    $scope.safeApply(function() {
                                        // renderedHtml is provided as a $sce.trustAsHtml content
                                        $scope.posts.form.content = renderedHtml;
                                    });
                                });
                            } else {
                                $scope.posts.form.content = val.content;
                            }
                        } else {
                            $scope.posts.form.content = val.content;
                            if (!skipRenderingMDEditor) {
                                MarkdownEditor.val($scope.posts.form.content);
                            }
                        }
                    });
                }

                $scope.posts.loadInProgress = false;
            }, function() {
                $scope.posts.loadInProgress = false;
            });
        } 
    };

    // watch rootScope user (when auth state changes)
    $scope.user = null;
    $scope.$watch('$root.user', function() {
        $scope.user = $rootScope.user;
    });
    
    switch ($state.current.name) {
        case 'post.new':
            $scope.posts.form.reset();
            MarkdownEditor.init('content-textarea');
            break;
        case 'post.update':
            MarkdownEditor.init('content-textarea');
            $scope.posts.load($state.params.postid);
            break;
        case 'post.get':
            $scope.posts.load($state.params.postid);
    }

}]);