(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('LocalStorage', LocalStorage);

    function LocalStorage($window, $rootScope){

        angular.element($window).on('storage', function(event) {
            if (event.key === 'current-user') {
                $rootScope.$apply();
            }
        });

        return {
            setUserFromLS: function(val) {
                return $window.localStorage && $window.localStorage.setItem('current-user', JSON.stringify(val));
            },
            getUserFromLS: function() {
                return $window.localStorage && $window.localStorage.getItem('current-user');
            },
            removeUserFromLS: function() {
                return $window.localStorage && $window.localStorage.removeItem('current-user');
            }
        };
    }
})();