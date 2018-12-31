describe('Post Controller', function() {

    beforeEach(module('zendocs'));

    describe('Initialization', function() {
        var scope, rootScope, ctrl, postid;
        beforeEach(function(done) {
            inject(function($controller, $rootScope, $http, $state, $rootScope, MarkdownEditor, ZNotif, ModalBox, $httpBackend) {
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                $state.current.name = 'post.get';
                $state.params.postid = '';

                $httpBackend.whenGET("/angular/templates/home.html").respond({ hello: 'World' });
                $httpBackend.expectGET("/angular/templates/home.html");    

                ctrl = $controller('PostController', {
                    $scope: scope, 
                    $http: $http,
                    $state: $state,
                    $rootScope: rootScope,
                    MarkdownEditor: MarkdownEditor,
                    ZNotif: ZNotif,
                    ModalBox: ModalBox,
                });
            });

            // get existing post id
            firebase.database().ref().child('posts').once('value', function(snap) {
                var val = snap.val();
                if (val) {
                    postid = objectValues(val)[0].postid;

                    scope.posts.load(postid, 'Skip MDE rendering').then(function() {
                        done();
                    });
                } else {
                    done();
                }
            });
        });


        it('should initialize the user', inject(function($httpBackend) {
            $httpBackend.whenGET("/angular/templates/home.html").respond({ hello: 'World' });
            $httpBackend.expectGET("/angular/templates/home.html");
            //console.log('postid', postid);
        }));

    });

});