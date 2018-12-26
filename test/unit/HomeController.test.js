describe('Home Controller', function() {

    beforeEach(module('zendocs'))

    
    describe('Initialization', function() {
        var scope, rootScope, ctrl;
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            rootScope = $rootScope.$new();
            ctrl = $controller('HomeController', {
                $scope: scope, 
                $rootScope: rootScope
            });
        }));

        afterEach(function() {
            // cleanup
        });

        it('should initialize the main object', function() {
            // check the scope 
            expect(scope.posts.searchString).toEqual('');
            expect(scope.posts.offset).toEqual(0);
            expect(scope.posts.data).toBeFalsy();
            expect(scope.posts.allData).toBeFalsy();
        });

    });

    describe('Initial data', function() {
        var scope, rootScope, ctrl;

        beforeEach(function(done) {
            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                ctrl = $controller('HomeController', {
                    $scope: scope, 
                    $rootScope: rootScope
                });
            });
            
            scope.posts.load().then(done);
        }); 

        it('should be loaded', function() {
            expect(scope.posts.data).not.toBeFalsy();
        });
    });

});