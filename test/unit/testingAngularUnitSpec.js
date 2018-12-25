describe('testing angular test suit', function() {

    describe('Test home controller', function() {

        it('should be initialized', function() {
            module('zendocs');
            var scope = {};

            var rootScope = {};
            var ctrl;

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                ctrl = $controller('HomeController', {$scope: scope, $rootScope: rootScope});
            });

            expect(scope.posts.offset).toBeDefined();
            expect(scope.posts.offset).toBe(0);
        });

    });

});