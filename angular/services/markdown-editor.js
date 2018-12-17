app.service('MarkdownEditor', ['$timeout', '$sce', function($timeout, $sce) {
    var editorScriptsLoaded = false;
    var loadEditorScripts = function(callbackFn) {
        if (!editorScriptsLoaded) {
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
            };
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);

            editorScriptsLoaded = true;
        } else {
            if (typeof(callbackFn) == 'function') {
                callbackFn();
            }
        }
    }
    
    var editorObj = null;
    var targetElemObj = null;

    var retObj = {
        init: function(elemId, callbackFn, attemptNumber) {
            // load the relevant JS/CSS scripts
            loadEditorScripts();

            // get the target element
            targetElemObj = document.getElementById(elemId);

            if (typeof(window.SimpleMDE) == 'undefined' || !targetElemObj) {
                if (!attemptNumber) {
                    attemptNumber = 0;
                }

                if (attemptNumber < 20) {
                    $timeout(function() {
                        retObj.init(elemId, callbackFn, attemptNumber + 1);
                    }, 1000);
                } else {
                    console.error('SimpleMDE was not loaded, or target element', elemId, 'does not exist on the page');
                }
                return;
            }

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