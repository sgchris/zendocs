app.controller('PostController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.posts = {
        form: {
            title: '',
            content: '',

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
            var content = $scope.posts.form.content;
            console.log('title, content', title, content);
        },

        update: function() {
            var title = $scope.posts.form.title;
            var content = $scope.posts.form.content;
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

}]);