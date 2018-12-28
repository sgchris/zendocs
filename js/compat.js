/**
 * Some complatibility functions
 */

/**
 * Return values of an object. Some browsers (like PhantomJS) don't
 * support Object.values method, this is a workaround
 * 
 * @param {Object} obj 
 * 
 * @return {Array}
 */
function objectValues(obj) {
    if (!obj || !(obj instanceof Object)) {
        return [];
    }

    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
};


/**
 * Dynamically download file with a string content
 * 
 * @param {String} filename The name of the file
 * @param {String} text The content
 * 
 * @return {Void}
 */
function downloadStringAsFile(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
