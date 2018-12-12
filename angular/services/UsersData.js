app.service('UsersData', [function() {
    var cache = {};

    return function(uid, callbackFn) {
        // check if the user is already in the cache
        if (typeof(cache[uid]) != 'undefined') {
            return callbackFn(cache[uid]);
        }

        firebase.database().ref('/users/' + uid).once('value', function(snap) {
            var val = snap ? snap.val() : null;
            callbackFn(val);
        });
    };

}]);