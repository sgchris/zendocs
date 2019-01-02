describe('Post Controller', function() {

    beforeEach(module('zendocs'));

    var scope, rootScope, ctrl = null, postid;
    beforeEach(function(done) {
        if (!ctrl) {
            // get posts, and set postid as the first post
            firebase.database().ref().child('posts').once('value', snap => {
                let val = snap.val();
                postid = val ? objectValues(val)[0].postid : null;
            }).then(() => {
                firebase.auth()
                    .signInWithEmailAndPassword('test32306@email.com', 'test.Email.com.123')
                    .then(() => {
                    inject(function($controller, $http, $state, $rootScope, MarkdownEditor, ZNotif, ModalBox, $httpBackend) {
                        scope = $rootScope.$new();
                        rootScope = $rootScope.$new();
                        $state.current.name = 'post.get';
                        $state.params.postid = postid;
        
                        $httpBackend.whenGET("/angular/templates/home.html").respond({ hello: 'World' });
                        $httpBackend.expectGET("/angular/templates/home.html");    
        
                        ctrl = $controller('PostController', {
                            $scope: scope,
                            $state: $state,
                            $rootScope: rootScope,
                            MarkdownEditor: MarkdownEditor,
                            ZNotif: ZNotif,
                            ModalBox: ModalBox,
                        });
                    });
        
                    // wait for the post to load
                    var attemptsNumber = 80;
                    (function checkLoadFinished(attemptNumber) {
                        attemptNumber = attemptNumber || 0;
                        if (scope.posts.form.postid === '' && attemptNumber < attemptsNumber) {
                            setTimeout(function() {
                                checkLoadFinished(attemptNumber+1);
                            }, 50);
                        } else {
                            if (attemptNumber >= attemptsNumber) {
                                console.log('Loading timed out');
                            }

                            done();
                        }
                    })();
                });
            });
        } else {
            done();
        }

    });


    describe('Initialization', function() {
        it('should load post data', inject(function() {
            expect(scope.posts.form.postid).toEqual(postid);
            expect(scope.posts.loadInProgress).toBeFalsy();
        }));
    });


    describe('add post', () => {
        let newPost, 
            newTitle = 'example title from the unit test';
        beforeEach(done => {
            scope.posts.form.title = newTitle;
            scope.posts.form.description = 'example description from the unit test';
            scope.posts.form.content = 'example content from the unit test';
            scope.posts.form.created_at = Math.floor((new Date()).getTime() / 1000);
            
            // add new post
            scope.posts.add(() => {

                // load all the posts
                firebase.database().ref().child('posts')
                    .orderByChild('created_at')
                    .once('value', snap => {
                        let val = snap.val();
                        if (val) {
                            let vals = objectValues(val);

                            // new post is the last one
                            newPost = vals[vals.length - 1];
                        }

                        done();
                    });
            });
        });

        it('should add a new post', () => {
            expect(newPost.title).toEqual(newTitle);
        });

        afterAll(done => {
            firebase.database().ref('posts/' + newPost.postid).remove().then(done);
        });

    });

    

});