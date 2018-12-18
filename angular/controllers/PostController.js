app.controller('PostController', [
    '$scope', '$http', '$state', '$rootScope', 'MarkdownEditor', 'ZNotif', '$timeout',
function($scope, $http, $state, $rootScope, MarkdownEditor, ZNotif, $timeout) {
    $scope.posts = {
        form: {
            postid: '',
            uid: '',
            title: '',
            content: '',
            description: '',

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

        add: function() {
            var title = $scope.posts.form.title;
            var description = $scope.posts.form.description;
            var content = MarkdownEditor.val();
            var user = firebase.auth().currentUser;

            var newPost = firebase.database().ref().child('posts').push();
            newPost.set({
                postid: newPost.key,
                uid: user.uid,
                fullname: user.displayName,

                title: title, 
                content: content,
                description: description,
                created_at: Math.floor((new Date()).getTime() / 1000),
            });

            ZNotif('New post', 'Post added successfully');
            $state.go('home', {}, {reload: true});
        },

        update: function() {
            var postid = $scope.posts.form.postid;
            var title = $scope.posts.form.title;
            var description = $scope.posts.form.description;
            var content = MarkdownEditor.val();

            var post = firebase.database().ref().child('posts/' + postid);
            post.update({
                title: title,
                description: description,
                content: content,
            });

            ZNotif('Post update', 'Post updated successfully');
        },

        delete: function (postid) {
            var post = firebase.database().ref('posts/' + postid).remove().then(function() {
                $state.go('home', {}, {reload: true});
                
                ZNotif('Delete post', 'Deleted successfully');
            }).catch(function(error) {
                ZNotif('Delete post', error.errorMessage, 'error');
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

        load: function(postid) {
            firebase.database().ref().child('posts/'+postid).once('value', function(snap) {
                var val = snap.val();
                $scope.safeApply(function() {
                    $scope.posts.form.postid = val.postid;
                    $scope.posts.form.uid = val.uid;
                    $scope.posts.form.title = val.title;
                    $scope.posts.form.description = val.description;

                    if ($state.current.name == 'post.get') {
                        MarkdownEditor.renderHtml(val.content, function(renderedHtml, isAsync) {
                            // if "async", use $apply
                            if (isAsync) {
                                $scope.safeApply(function() {
                                    // renderedHtml is provided as a $sce.trustAsHtml content
                                    $scope.posts.form.content = renderedHtml;
                                });
                            } else {
                                $scope.posts.form.content = renderedHtml;
                            }
                        });
                    } else {
                        $scope.posts.form.content = val.content;

                        MarkdownEditor.val($scope.posts.form.content);
                    }
                });
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