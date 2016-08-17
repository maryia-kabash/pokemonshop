(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('UsersFactory', UsersFactory);

    function UsersFactory($resource, constant){
        return $resource(constant.usersUrl,
            {id: '@id', email: '@email', password: '@password', apiKey: constant.apiKey}, {
                update:{
                    method: 'PUT',
                    isArray: false
                },
                query: {
                    method: 'GET',
                    isArray:true,
                    interceptor: {
                        response: function(response) {
                            return response.data;
                        }
                    }
                },
                get: {
                    method: 'GET',
                    isArray:false
                },
                find: {
                    method: 'GET',
                    isArray: false,
                    interceptor: {
                        response: function(response) {
                            return response.data;
                        }
                    }
                }
            });
    }
})();