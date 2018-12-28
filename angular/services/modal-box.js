app.service('ModalBox', [function() {
    var defaultOptions = {
        width: 400,
        closeOnUnfocus: true, // close the popup while clicking outside
    };

    var removeBox = function () {
        angular.element('.confirmation-box-curtain').remove();
        angular.element('.confirmation-box-popup').remove();
    };

    /**
     * display a text box above a curtain
     * 
     * @param {string} title 
     * @param {string} text the main text of the popup
     * @param {array} buttons [{caption: 'foo', callback: function(){}, class: 'primary'}, {...}, ...]
     * @param {array} optionsOverride default: {width:400, closeOnUnfocus:true}
     */
    var showBox = function(title, text, buttons, optionsOverride) {
        // prepare the popup options
        var options = angular.extend({}, defaultOptions, optionsOverride);

        // remove previously shown popup
        removeBox();
        
        // define the elements
        var curtain = angular.element('<div>')
            .addClass('confirmation-box-curtain')
            .css({
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1001,
                backgroundColor: 'rgba(255,255,255, 0.85)'
            });
            
            // close the popup when clicking outside
            if (options.closeOnUnfocus) { 
                curtain.on('click', function() {
                    removeBox();
                });
            }
            
            // init the popup itself
            var popup = angular.element('<div>')
            .addClass('confirmation-box-popup')
            .css({
                position: 'fixed',
                top: '30%',
                backgroundColor: '#FFF',
                border: '1px solid #DDD',
                boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                zIndex: 1002,
                padding: '10px',
                width: options.width + 'px',
            })
            //.css('left', 'calc(100% - ' + options.width + 'px)');
            .css('left', 'calc(50% - '+(options.width / 2)+'px)');

        if (title) {
            var header = angular.element('<h3>')
                .text(title)
                .css({
                    borderBottom: '1px solid #EEE',
                    marginBottom: '10px',
                    paddingBottom: '10px'
                });
            popup.append(header);
        }

        if (text) {
            var textbox = angular.element('<div>')
                .html(text);
            popup.append(textbox);
        }

        // create buttons wrapper
        var buttonsbox = angular.element('<div>')
            .css({
                textAlign: 'right',
                borderTop: '1px solid #EEE',
                paddingTop: '10px',
                marginTop: '10px'
            });

        if (buttons) {
            // add buttons
            buttons.forEach(function(buttonData, i) {
                buttonData.class = buttonData.class || 'primary';
                buttonData.caption = buttonData.caption || 'Button #' + (i+1);
                var buttonHtml = angular.element('<a>')
                    .addClass('btn')
                    .addClass('btn-' + buttonData.class)
                    .css({
                        marginLeft: '10px'
                    })
                    .html(buttonData.caption)
                    .on('click', function() {
                        if (typeof(buttonData.callback) == 'function') {
                            buttonData.callback();
                            removeBox();
                        }
                    });

                buttonsbox.append(buttonHtml);
            });
        } else {
            // add "Ok" button
            var okButtonHtml = angular.element('<a>')
                .addClass('btn')
                .addClass('btn-primary')
                .css({
                    marginLeft: '10px'
                })
                .html("Ok")
                .on('click', function() {
                    removeBox();
                });

            buttonsbox.append(okButtonHtml);
        }

        // add "cancel" button
        var cancelButtonHtml = angular.element('<a>')
            .addClass('btn')
            .addClass('btn-outline-secondary')
            .css({
                marginLeft: '10px'
            })
            .html("Cancel")
            .on('click', function() {
                removeBox();
            });

        buttonsbox.append(cancelButtonHtml);



        popup.append(buttonsbox);

        $('body').append(curtain).append(popup);
    };

    var retObj = {
        /**
         * 
         * @param {String} title Optional. The title at the top
         * @param {String} text the content of the popup. Might be HTML
         * @param {Function} callbackFn The callback upon positive confirmation
         * @param {Function} failureCallbackFn The callback upon negative confirmation
         * @param {Array} options list of options. Default: {width:400, closeOnUnfocus:true}
         */
        confirm: function(title, text, callbackFn, failureCallbackFn, options) {
            showBox(title, text, [{
                caption: 'Ok',
                callback: callbackFn
            }], options);
        },
    };

    return retObj;
}]);