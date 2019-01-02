describe('Post Controller', function() {

    beforeEach(module('zendocs'));

    var scope, rootScope, ctrl = null, postid;
    beforeEach(function(done) {
        if (!ctrl) {
            inject(function($controller, $http, $state, $rootScope, MarkdownEditor, ZNotif, ModalBox, $httpBackend) {
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                $state.current.name = 'post.get';
                $state.params.postid = '';

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

    /*
    describe('Insert and delete a post', () => {

        // create and delete a temporary user
        beforeEach(function(done) {
            const randNumber = Math.floor(Math.random() * 100000);
            const testEmail = 'test' + randNumber + '@email.com';
            const testPassword = 'test.Email.com.123';
            console.log('creating new user', testEmail);
            firebase.auth()
                .createUserWithEmailAndPassword(testEmail, testPassword)
                .then(_ => {
                    console.log('created', testEmail);
                    firebase.auth()
                        .signInWithEmailAndPassword(testEmail, testPassword)
                        .then(() => {
                            console.log('authenticated');
                            done();
                        })
                        .catch(err => {
                            console.log('signInWithEmailAndPassword err', err);
                        });
                })
                .catch(err => {
                    console.log('createUserWithEmailAndPassword err', err);
                });
        });

        // afterEach(done => {
        //     console.log('after each');
        //     let user = firebase.auth().currentUser;
        //     if (user) {
        //         user.delete().then(() => {
        //             console.log('deleted the user');
        //             done();
        //         });
        //     } else {
        //         done();
        //     }
        // });



        it('should add a new post', () => {
            let currentUser = firebase.auth().currentUser;
            expect(typeof(currentUser)).toBe('object');
            
            scope.posts.form.title = 'example title from the unit test';
            scope.posts.form.description = 'example description from the unit test';
            scope.posts.form.content = 'example content from the unit test';
            
            console.log('currentUser', currentUser);
            scope.posts.add(() => {
                console.log('added');
            });
        });
    });
    */

});