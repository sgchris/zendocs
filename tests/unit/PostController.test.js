describe('Post Controller', function() {

    beforeEach(module('zendocs'));

    describe('Initialization', function() {
        var scope, rootScope, ctrl;
        beforeEach(inject(function($controller, $rootScope, $http, $state, $rootScope, MarkdownEditor, ZNotif, ModalBox) {
            scope = $rootScope.$new();
            rootScope = $rootScope.$new();
            $state.current.name = 'post.get';
            $state.params.postid = 'abc';

            ctrl = $controller('PostController', {
                $scope: scope, 
                $http: $http,
                $state: $state,
                $rootScope: rootScope,
                MarkdownEditor: MarkdownEditor,
                ZNotif: ZNotif,
                ModalBox: ModalBox,
            });

        }));

        it('should initialize the user', function() {
            // check the scope 
            expect(scope.user).toBeDefined();
            expect(scope.posts.loadInProgress).toBeTruthy();
        });

    });

});