describe('Post Controller', function() {

    beforeEach(module('zendocs'));

    var scope, rootScope, ctrl = null, postid;

    // 1. Get the latest post id, 
    // 2. Authenticate the user
    // 3. override the modal box (confirm box)
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
                    inject(function($controller, $http, $state, $rootScope, MarkdownEditor, ZNotif, $httpBackend) {
                        // override modal box confirmation
                        var ModalBox = {
                            confirm: (a, b, callbackFn) => callbackFn()
                        };
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


    var testTitle = 'example title from the unit test';
    var testDescription = 'example description from the unit test';
    var testContent = 'example content from the unit test';
    var getCurrentTimestamp = () => Math.floor((new Date()).getTime() / 1000);


    describe('Initialization', function() {
        it('should load post data', inject(function() {
            // check that the post loaded, and it's the latest one (the one required)
            expect(scope.posts.form.postid).toEqual(postid);

            // check that it marked the loading as finished
            expect(scope.posts.loadInProgress).toBeFalsy();
        }));
    });

    describe('add post', () => {
        var newPost;

        beforeEach(done => {
            scope.posts.form.title = testTitle;
            scope.posts.form.description = testDescription;
            scope.posts.form.content = testContent;
            scope.posts.form.created_at = getCurrentTimestamp();
            
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
            // check that the latest post is the new one
            expect(newPost.title).toEqual(testTitle);
        });

        afterAll(done => {
            firebase.database().ref().child('posts/' + newPost.postid).remove().then(done);
        });

    });

    // update the post
    describe('update post', () => {
        var newPost, updatedPost;

        beforeEach(done => {
            newPost = firebase.database().ref().child('posts').push();
            newPost.set({
                postid: newPost.key,
                title: testTitle, 
                content: testContent,
                description: testDescription
            }, function(err) {
                if (err) {
                    console.log('cannot add new post');
                }
            }).then(() => {
                scope.posts.form.postid = newPost.postid;
                scope.posts.form.title = testTitle + ' updated';
                scope.posts.form.description = testDescription + ' updated';
                scope.posts.form.content = testContent + ' updated';
                
                // update the new post
                scope.posts.update().then(() => {
                    // load all the posts
                    firebase.database().ref().child('posts')
                        .orderByChild('created_at')
                        .once('value', snap => {
                            let val = snap.val();
                            if (val) {
                                let vals = objectValues(val);
    
                                // new post is the last one
                                updatedPost = vals[vals.length - 1];
                            }
    
                            done();
                        });
                });

            });

        });

        it('should updated the new post', () => {
            // check that the latest post is the new one
            expect(updatedPost.title).toEqual(testTitle + ' updated');
        });

        afterAll(done => {
            firebase.database().ref().child('posts/' + newPost.postid).remove().then(done);
        });
    });


    // Delete the post
    describe('Delete post', () => {
        var newPost, postDeleted = false;

        beforeEach(done => {
            newPost = firebase.database().ref().child('posts').push();
            newPost.set({
                postid: newPost.key,
                title: testTitle, 
                content: testContent,
                description: testDescription
            }, function(err) {
                console.log('cannot add new post');
            }).then(() => {
                // delete the new post
                scope.posts.delete(newPost.postid);

                // wait for the delete function to finish
                (function checkDeleteFinished() {
                    if (typeof(window.___checkDeleteFinishedAttempts) == 'undefined') {
                        window.___checkDeleteFinishedAttempts = 0;
                    } else {
                        ++window.___checkDeleteFinishedAttempts;
                    }

                    if (scope.posts.form.inProgress && window.___checkDeleteFinishedAttempts < 80) {
                        setTimeout(() => {
                            checkDeleteFinished();
                        }, 50);
                    } else {
                        if (window.___checkDeleteFinishedAttempts < 80) {
                            postDeleted = true;
                        }
                        delete window.___checkDeleteFinishedAttempts;
                        done();
                    }
                }());

            });

            it('should delete the post', () => {
                expect(postDeleted).toBeTruthy();
            });
        });

        afterAll(done => {
            firebase.database().ref().child('posts/' + newPost.postid).remove().then(done);
        });
    });

    /*
    afterAll(done => {
            scope.posts.delete(newPost.postid);

            // wait for the delete function to finish
            (function checkDeleteFinished() {
                if (typeof(window.___checkDeleteFinishedAttempts) == 'undefined') {
                    window.___checkDeleteFinishedAttempts = 0;
                } else {
                    ++window.___checkDeleteFinishedAttempts;
                }

                if (scope.posts.form.inProgress && window.___checkDeleteFinishedAttempts < 80) {
                    setTimeout(() => {
                        checkDeleteFinished();
                    }, 50);
                } else {
                    delete window.___checkDeleteFinishedAttempts;
                    done();
                }
            }());
        });
    */

});