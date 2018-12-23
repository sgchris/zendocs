app.service('ZNotif', function() {
    return function(title, message, type) {
        var opts = {
            title: title, 
            message: message,
            icon: 'fas fa-exclamation-circle',
        };
        if (type == 'warning') {
            opts.icon = 'fas fa-exclamation-triangle';
            opts.type = 'warning';
        } else if (type == 'error') {
            opts.icon = 'fas fa-exclamation-circle';
            opts.type = 'danger';
        }

        $.notify(opts);
    };
});