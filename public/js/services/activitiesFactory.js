(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('ActivitiesFactory', ActivitiesFactory);

    function ActivitiesFactory($resource, constant){
        return $resource(constant.activitiesUrl,
            {_id: '@id', boardId: '@boardId', apiKey: constant.apiKey}, {
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