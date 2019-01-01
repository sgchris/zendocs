describe('Post Controller', function() {

    beforeEach(module('zendocs'));

    var scope, rootScope, ctrl = null, postid;
    beforeEach(function(done) {
        if (!ctrl) {
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

        }    

    });


    describe('Initialization', function() {
        it('should load post data', inject(function() {
            expect(scope.posts.form.postid).toEqual(postid);
            expect(scope.posts.loadInProgress).toBeFalsy();
        }));
    });


});