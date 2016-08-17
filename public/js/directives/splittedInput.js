(function(){
    'use strict';

    angular
        .module("bugs")
        .directive('splittedInput', splittedInput)
        .directive('splittedInputField', splittedInputField);

    function splittedInput(){

        return {
            controller: 'SplittedInputCrtl as split'
        };
    }

    function splittedInputField(){
        var BACKSPACE_KEYCODE = 8;

        return {
            require: '^^splittedInput',
            link: function(scope, element, attr, ctrl) {

                ctrl.registerField(element);

                var prevVal;

                element.on('keypress', function (e) {
                    prevVal = element.val() || '';

                    window.setTimeout(function () {
                        if (element.val().length === +attr.maxlength) {
                            ctrl.focusNextField(element, prevVal.length === +attr.maxlength ? String.fromCharCode(e.keyCode) : null);
                        }
                    }, 0);
                });

                element.on('keydown', function (e) {
                    if (element.val().length === 0 && e.keyCode === BACKSPACE_KEYCODE) {
                        ctrl.focusPrevField(element);
                    }
                });
            }
        };
    }
})();