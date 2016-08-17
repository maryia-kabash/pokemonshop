(function(){
    'use strict';

    angular
        .module("bugs")
        .controller('LoginModalCtrl', LoginModalCtrl);

    function LoginModalCtrl(LoginManipulator, $uibModalInstance){
        var login = this;

        login.login = function (username, password) {
            login.message = "";

            LoginManipulator.login(username, password, function(message, res){
                login.message = message;
                if(res){
                    setTimeout(function(){
                        $uibModalInstance.close();
                    }, 1500);
                }
            });
        };

        login.signup = function (username, email, password) {
            login.errorMsg = "";

            LoginManipulator.signup(username, email, password, function(message, res){
                login.errorMsg = message;
                if(res){
                    setTimeout(function(){
                        $uibModalInstance.close();
                    }, 1500);
                }
            });
        };

        login.dismiss = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();