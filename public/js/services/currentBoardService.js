(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('CurrentBoard', CurrentBoard);

    function CurrentBoard($window){
        var currentboard;

        return {
            setCurrentBoard: function (data) {
                $window.localStorage.setItem('currentboard', JSON.stringify(data));
                currentboard = data;
            },
            getCurrentBoard: function () {
                currentboard = currentboard || JSON.parse($window.localStorage.getItem('currentboard'));
                return currentboard;
            }
        };
    }
})();