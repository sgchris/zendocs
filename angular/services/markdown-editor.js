app.service('MarkdownEditor', ['$timeout', function($timeout) {
    var editorScriptsLoaded = false;
    var loadEditorScripts = function() {
        if (!editorScriptsLoaded) {
            ///////// load CSS
            var myCSS = document.createElement( "link" );
            myCSS.rel = "stylesheet";
            myCSS.href = "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css";
            document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );

            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js';
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);

            editorScriptsLoaded = true;
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
            console.log('initialContent', initialContent, 'angular.element(targetElemObj)', angular.element(targetElemObj));

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
            debugger;
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
    };

    return retObj;
}]);