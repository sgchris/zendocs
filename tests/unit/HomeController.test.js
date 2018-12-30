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

    describe('Filter data by search string', function() {
        var scope, rootScope, ctrl;

        beforeEach(function() {
            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                ctrl = $controller('HomeController', {
                    $scope: scope, 
                    $rootScope: rootScope
                });
            });
        }); 

        var exampleData = [{
            title: 'Tesla has  added two independent directors to its board',
            description: 'Oracle founder, chairman and CTO Larry Ellison and Walgreens executive Kathleen Wilson-Thompson',
            content: 'Oracle founder, chairman and CTO Larry Ellison and Walgreens executive Kathleen Wilson-Thompson — as part of a settlement with U.S. securities regulators over CEO Elon Musk’s infamous tweets about taking the company private.'
        }, {
            title: 'The Tesla board, led by its Nominating and Corporate Governance Committee',
            description: 'Mission of accelerating the world’s transition to sustainable energy',
            content: 'said it considered candidates with a “wide range of skill sets” from across the globe who also hold a strong personal belief in Tesla’s mission of accelerating the world’s transition to sustainable energy.'
        }];

        it('should return all the values on empty search string', function() {
            scope.posts.searchString = '';
            expect(scope.posts.filterResultsBySearchString(exampleData)).toEqual(exampleData);
        });

        it('should return all the values on empty search string', function() {
            scope.posts.searchString = 'tesla';
            expect(scope.posts.filterResultsBySearchString(exampleData)).toEqual(exampleData);
        });

        it('should find one record', function() {
            scope.posts.searchString = 'tesla independent oracle founder'; // several search strings matching the first record
            expect(scope.posts.filterResultsBySearchString(exampleData)).toEqual([exampleData[0]]); // array with one element (the first record)
        });

        it('should find no records', function() {
            scope.posts.searchString = 'rhythm conscience indict handkerchief accommodate weird'; // several search strings matching the first record
            expect(scope.posts.filterResultsBySearchString(exampleData)).toEqual([]);
        });
    });

    describe('Pagination', function() {
        var scope, rootScope, ctrl;

        beforeEach(function() {
            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                ctrl = $controller('HomeController', {
                    $scope: scope, 
                    $rootScope: rootScope
                });
            });
        });

        var exampleData = [{
            title: 'Tesla 111 has  added two independent directors to its board',
            description: 'Oracle 111 founder, chairman and CTO Larry Ellison and Walgreens executive Kathleen Wilson-Thompson',
            content: 'Oracle 111 founder, chairman and CTO Larry Ellison and Walgreens executive Kathleen Wilson-Thompson — as part of a settlement with U.S. securities regulators over CEO Elon Musk’s infamous tweets about taking the company private.'
        }, {
            title: 'The Tesla 222 board, led by its Nominating and Corporate Governance Committee',
            description: 'Mission 222 of accelerating the world’s transition to sustainable energy',
            content: 'said it 222 considered candidates with a “wide range of skill sets” from across the globe who also hold a strong personal belief in Tesla’s mission of accelerating the world’s transition to sustainable energy.'
        }, {
            title: 'Tesla 333 has  added two independent directors to its board',
            description: 'Oracle 333 founder, chairman and CTO Larry Ellison and Walgreens executive Kathleen Wilson-Thompson',
            content: 'Oracle 333 founder, chairman and CTO Larry Ellison and Walgreens executive Kathleen Wilson-Thompson — as part of a settlement with U.S. securities regulators over CEO Elon Musk’s infamous tweets about taking the company private.'
        }, {
            title: 'The Tesla 444 board, led by its Nominating and Corporate Governance Committee',
            description: 'Mission 444 of accelerating the world’s transition to sustainable energy',
            content: 'said4 444 it considered candidates with a “wide range of skill sets” from across the globe who also hold a strong personal belief in Tesla’s mission of accelerating the world’s transition to sustainable energy.'
        }];

        it('should return "resultsPerPage" items', function() {
            scope.posts.resultsPerPage = 2;
            scope.posts.allData = exampleData;
            scope.posts.setData();
            expect(scope.posts.data.length).toEqual(2);
            expect(scope.posts.data[0].title).toContain('444');
        });

        it('should switch to the next page', function() {
            scope.posts.resultsPerPage = 2;
            scope.posts.allData = exampleData;
            scope.posts.setData();
            scope.posts.previousPage();
            expect(scope.posts.data.length).toEqual(2);
            expect(scope.posts.data[0].title).toContain('222');

            scope.posts.nextPage();
            expect(scope.posts.data.length).toEqual(2);
            expect(scope.posts.data[0].title).toContain('444');
        });

    });

});