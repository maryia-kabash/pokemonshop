(function(){
    'use strict';

    angular
        .module("bugs")
        .controller('IndexCtrl', IndexCtrl);

    function IndexCtrl(BoardFactory, $scope, $uibModal, $rootScope, LoginModal, $state, LocalStorage, CurrentBoard){
        var index = this;

        // Get list of boards and update on adding a new one
        BoardFactory.query().$promise.then(function(data) {
            index.boards = data;
        });
        $scope.$on("reload", function(){
            BoardFactory.query().$promise.then(function(data) {
                index.boards = data;
            });
        });

        index.currentUser = JSON.parse(LocalStorage.getUserFromLS());

        function checkAuthentication(settings, type){
            var modalInstance;
            if ( index.currentUser === null || typeof $rootScope.currentUser === 'undefined') {
                LoginModal.openmodal()
                    .then(function () {
                        modalInstance = $uibModal.open(settings);
                        return modalInstance;
                    })
                    .catch(function () {
                        return $state.go('index');
                    });
            } else {
                modalInstance = $uibModal.open(settings);
            }
            if(typeof modalInstance !== 'undefined'){
                modalInstance.result.then(function(){
                    if(type == "bug"){
                        var board = CurrentBoard.getCurrentBoard();
                        $state.go('dashboard', {boardID: board._id.$oid}, { reload: true });
                    } else if (type == "board") {
                        $scope.$emit("reload");
                    }
                });
            }
        }

        var cardModalSettings = {
            templateUrl: 'views/partials/newCard.html',
            controller: 'CreateCtrl as create',
            resolve: {
                allBoards: function(BoardFactory){
                    return BoardFactory.query().$promise.then(function(data) {
                        return data;
                    });
                }
            }

        };
        var boardModalSettings = {
            templateUrl: 'views/partials/newBoard.html',
            controller: 'CreateCtrl as create'
        };

        index.modalBug = function () {
            checkAuthentication(cardModalSettings, "bug");
        };

        index.modalBoard = function () {
            checkAuthentication(boardModalSettings, "board");
        };

        index.modalLogin = function () {
            LoginModal.openmodal().then(function(){
              index.currentUser = JSON.parse(LocalStorage.getUserFromLS());
            });
        };

        index.logout = function(){
            $rootScope.currentUser = 'undefined';
            LocalStorage.removeUserFromLS();
            $state.go('index');
            $scope.$emit("reload");
        };

        index.checkLogin = function(){
            $rootScope.currentUser = LocalStorage.getUserFromLS();
            return $rootScope.currentUser;
        };
    }
})();