(function(){
    'use strict';

    angular
        .module("bugs", ['ui.router', 'as.sortable', 'ui.bootstrap', 'ngResource', 'dtrw.bcrypt'])

        .run(function ($rootScope, LoginModal, $state) {

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;

                if (requireLogin &&
                    (typeof $rootScope.currentUser === 'undefined'||
                    $rootScope.currentUser === null)) {

                    event.preventDefault();

                    LoginModal.openmodal()
                        .then(function () {
                            return $state.go(toState.name, toParams);
                        })
                        .catch(function () {
                            return $state.go('index');
                        });
                }
            });

        })

        .config(function config($stateProvider, $locationProvider, $httpProvider){

            $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
                var LoginModal, $http, $state;

                $timeout(function () {
                    LoginModal = $injector.get('LoginModal');
                    $http = $injector.get('$http');
                    $state = $injector.get('$state');
                });

                return {
                    responseError: function (rejection) {
                        if (rejection.status !== 401) {
                            return $q.reject(rejection);
                        }

                        var deferred = $q.defer();

                        LoginModal.openmodal()
                            .then(function () {
                                deferred.resolve( $http(rejection.config) );
                            })
                            .catch(function () {
                                $state.go('index');
                                deferred.reject(rejection);
                            });

                        return deferred.promise;
                    }
                };
            });

            $stateProvider.state("index", {
                url: '/',
                controller: 'IndexCtrl',
                templateUrl: 'views/start.html',
                data: {
                    requireLogin: false
                }
            });

            $stateProvider.state("dashboard", {
                url: '/board/:boardID',
                controller: 'MainCtrl',
                controllerAs: 'main',
                templateUrl: 'views/dashboard.html',
                data: {
                    requireLogin: true
                },
                resolve: {
                    currentBrd: function($stateParams, BoardFactory, CurrentBoard) {
                        if($stateParams.boardID.length > 0){
                            return BoardFactory.find({ _id: $stateParams.boardID }).$promise.then(function(res) {
                                CurrentBoard.setCurrentBoard(res);
                                return res;
                            });
                        }
                    }
                }
            });

            $stateProvider.state("edit", {
                url: '/edit/:editId',
                controller: 'EditCtrl',
                controllerAs: 'edit',
                templateUrl: 'views/edit.html',
                data: {
                    requireLogin: true
                },
                resolve: {
                    currentBug: function($stateParams, CurrentBoard){
                        var currentBoard = CurrentBoard.getCurrentBoard();
                        var bugIndex = $stateParams.editId;
                        var columnOrder = +bugIndex.slice(0, 1);
                        var bugs = currentBoard.columns[columnOrder].bugs;
                        for (var j = 0; j < bugs.length; j++) {
                            if (bugs[j].index === bugIndex) {
                                return bugs[j];
                            }
                        }
                    },
                    activities: function($stateParams, CurrentBoard, ActivitiesFactory){
                        var currentBoard = CurrentBoard.getCurrentBoard();
                        var bugIndex = $stateParams.editId;
                        var bugNumber = bugIndex.substring(2);
                        var activity = {
                            fo: true,
                            q: {
                                boardId: currentBoard._id,
                                bugNumber: bugNumber
                            }
                        };

                        return ActivitiesFactory.find(activity).$promise.then(function(data) {
                            var activities = data;

                            if(activities.moved.length > 0) {
                                var columnNames = [];
                                for (var i = 0; i < currentBoard.columns.length; i++) {
                                    columnNames.push(currentBoard.columns[i].name);
                                }
                                for (var n = 0; n < activities.moved.length; n++) {
                                    activities.moved[n].fromColumn = columnNames[activities.moved[n].fromColumn];
                                    activities.moved[n].toColumn = columnNames[activities.moved[n].toColumn];
                                }
                            }
                            return activities;
                        });
                    }
                }
            });

            $locationProvider.html5Mode(true).hashPrefix('!');
        });
})();