(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('LoginModal', LoginModal);

    function LoginModal($uibModal){

        return {
            openmodal: function() {

                var modalInstance = $uibModal.open({
                    templateUrl: 'views/partials/loginModal.html',
                    controller: 'LoginModalCtrl',
                    controllerAs: 'login'
                });

                return modalInstance.result;
            }
        };
    }
})();