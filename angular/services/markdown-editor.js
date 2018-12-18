app.service('MarkdownEditor', ['$timeout', '$sce', function($timeout, $sce) {
    var editorScriptsLoaded = false;
    var editorScriptsLoadInProgress = false;
    var loadEditorScripts = function(callbackFn) {
        if (!editorScriptsLoaded) {

            // if loading is in progress, call this function later (w/ timeout)
            if (editorScriptsLoadInProgress && callbackFn) {
                // generate a timer and attempts counter vars
                var callbackMD5 = btoa(callbackFn);
                var timerName = callbackMD5 + '_loadScriptsTimer';
                var counterName = callbackMD5 + '_loadScriptsAttemptsCounter';

                // cancel previous timer
                if (window[timerName]) {
                    $timeout.cancel(window[timerName]);
                }

                // start new timer
                window[btoa(callbackFn) + '_loadScriptsTimer'] = $timeout(function() { 
                    window[counterName] = window[counterName] || 0;

                    if (window[counterName]++ < 40) {
                        loadEditorScripts(callbackFn);
                    }
                }, 500);

                return;
            }

            editorScriptsLoadInProgress = true;

            ///////// load CSS
            var myCSS = document.createElement( "link" );
            myCSS.rel = "stylesheet";
            myCSS.href = "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css";
            document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );

            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js';
            s.onload = function() {
                if (typeof(callbackFn) == 'function') {
                    callbackFn('async');
                }

                editorScriptsLoaded = true;
                editorScriptsLoadInProgress = false;
            };
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        } else {
            if (typeof(callbackFn) == 'function') {
                callbackFn();
            }
        }
    }
    
    var editorObj = null;

    var retObj = {
        init: function(elemId, callbackFn, attemptNumber) {
            console.log('init MDE elem', elemId);
            // get the target element (w/ retries)
            var targetElemObj = document.getElementById(elemId);
            if (!targetElemObj) {
                attemptNumber = attemptNumber || 0;

                if (attemptNumber++ < 40) {
                    $timeout(function() {
                        retObj.init(elemId, callbackFn, attemptNumber);
                    }, 500);
                } else {
                    console.error('No target element for the MDE editor', elemId);
                }

                return;
            }

            // load the relevant JS/CSS scripts
            loadEditorScripts(function(isAsync) {
                // initial content 
                var initialContent = angular.element(targetElemObj).text();

                // create the element
                editorObj = new SimpleMDE({ 
                    element: targetElemObj,
                    initialValue: initialContent
                });

                // call back
                if (typeof(callbackFn) == 'function') {
                    callbackFn()
                }
            });
        },

        val: function(newContent, attemptNumber) {
            if (editorObj) {
                if (newContent) {
                    // set value
                    return editorObj.value(newContent);
                } else {
                    // get value
                    return editorObj.value();
                }
            } else if (newContent) {
                // in case of writing the val, wait for the object
                if (!attemptNumber) {
                    attemptNumber = 0;
                }

                if (attemptNumber < 20) {
                    $timeout(function() {
                        retObj.val(newContent, attemptNumber + 1);
                    }, 1000);
                    return null;
                }
            }

            return null;
        },

        renderHtml: function(content, callbackFn) {
            //var mdeObj = new SimpleMDE();
            loadEditorScripts(function(isAsync) {
                // generate MDE instance
                var elemWrapper = document.createElement('div');
                var elem = document.createElement('textarea');
                elemWrapper.appendChild(elem);
                document.body.appendChild(elemWrapper);
                var mde = new SimpleMDE({
                    element: elem
                });

                // render HTML
                var renderedHtml = mde.options.previewRender(content);

                // remove the element
                angular.element(elemWrapper).empty().remove();
                delete mde;
                
                // call back
                callbackFn($sce.trustAsHtml(renderedHtml), isAsync);
            });
        }
    };

    return retObj;
}]);