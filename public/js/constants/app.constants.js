(function(){
    'use strict';

    angular
        .module("bugs")
        .constant('constant', {
            boardUrl: 'https://api.mongolab.com/api/1/databases/angular-bugs/collections/boards/:_id',
            usersUrl: 'https://api.mongolab.com/api/1/databases/angular-bugs/collections/users/:_id',
            activitiesUrl: 'https://api.mongolab.com/api/1/databases/angular-bugs/collections/activities/:_id',
            apiKey: '7sv3TyZTnueG_eTdxqgxa9zUjbDGtmOx'
        });
})();