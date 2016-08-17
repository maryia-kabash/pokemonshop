(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('BoardFactory', BoardFactory);

    function BoardFactory($resource, constant){
        return $resource(constant.boardUrl,
            {_id: '@id', apiKey: constant.apiKey}, {
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