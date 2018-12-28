describe('objectValues function', function() {

    it('should return empty value', function() {
        var o = {};
        expect(objectValues(o)).toEqual([]);
    });

    it('should return empty value', function() {
        var o = null;
        expect(objectValues(o)).toEqual([]);
    });

    it('should return empty value', function() {
        var o = 'some string';
        expect(objectValues(o)).toEqual([]);
    });

    it('should return empty value', function() {
        var o = [];
        expect(objectValues(o)).toEqual([]);
    });

    it('should return values', function() {
        var o = {a: 1, b: 2};
        expect(objectValues(o)).toEqual([1, 2]);
    });

    it('should return values', function() {
        var o = [1, 2];
        expect(objectValues(o)).toEqual([1, 2]);
    });

});