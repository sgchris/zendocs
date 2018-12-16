app.controller('PostController', ['$scope', '$http', '$state', 'MarkdownEditor', function($scope, $http, $state, MarkdownEditor) {
    $scope.posts = {
        form: {
            title: '',
            content: '',
            description: '',

            errorMessage: '',

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
            console.log('newPost', newPost);
            newPost.set({
                postid: newPost.key,
                uid: user.uid,
                fullname: user.displayName,

                title: title, 
                content: content,
                description: description,
                created_at: Math.floor((new Date()).getTime() / 1000),
            });

            $state.go('home');
        },

        update: function() {
            var title = $scope.posts.form.title;
            var content = MarkdownEditor.val();
            var description = $scope.posts.form.description;

            console.log('title, content', title, content);
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
                $scope.posts.form.title = val.title;
                $scope.posts.form.content = val.content;

                console.log('loaded', $scope.posts.form);
            });
        } 
    };

    if ($state.current.name == 'post.new') {
        MarkdownEditor.init('content-textarea', function() {
            // .. initialized
        });
    }

}]);