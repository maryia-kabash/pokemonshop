(function(){
    'use strict';

    angular
        .module("bugs")
        .directive('cardItem', cardItem);

    function cardItem(){

        return {
            templateUrl: 'views/partials/card.html'
        };
    }
})();