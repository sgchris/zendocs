/**
 * Some complatibility functions
 */

var objectValues = function(obj) {
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
};