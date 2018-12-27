/**
 * Some complatibility functions
 */

var objectValues = function(obj) {
    if (!obj || !(obj instanceof Object)) {
        return [];
    }
    
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
};