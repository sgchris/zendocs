app.filter('timestampToRelativeDate', [function() {
    return function(ts) {
        // check if ts is in milliseconds
        if (('' + ts).length > 10) {
            ts = Math.floor(ts / 1000);
        }

        var currentTimestamp = Math.floor((new Date()).getTime() / 1000);
        var period = currentTimestamp - ts;

        var days = parseInt(period / (3600 * 24));
        period -= (days * 3600 * 24);
        var hours = parseInt(period / 3600);
        period -= (hours * 3600);
        var minutes = parseInt(period / (60));

        var timeElements = [];
        if (days > 0) {
            timeElements.push(days + ' day' + (days != 1 ? 's' : ''));
        }
        if (hours > 0) {
            timeElements.push(hours + ' hour' + (hours != 1 ? 's' : ''));
        }
        if (minutes > 0) {
            timeElements.push(minutes + ' minute' + (minutes != 1 ? 's' : ''));
        }
        if (timeElements.length === 0) {
            timeElements.push('less than a minute');
        }

        return timeElements.slice(0, 2).join(' and ') + ' ago';
    };
}]);


app.filter('contentPreview', [function() {
    return function(content) {
        // just reluctantly cut the text
        return content.substr(0, 500); 
    };
}]);