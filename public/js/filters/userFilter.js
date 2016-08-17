(function(){
    'use strict';

    angular
        .module("bugs")
        .filter('UserFilter', UserFilter);

    function UserFilter(){

        return function (cards, selectedUser) {
            //if (cards.length > 0 && selectedUser ) {
            if ( selectedUser ) {
                var tempCards = [];

                var elem =  angular.element(document.getElementsByClassName(selectedUser));
                var elems =  angular.element(document.querySelectorAll(".author"));
                elems.removeClass("btn-info");
                elem.addClass("btn-info");

                angular.forEach(cards, function (card) {
                    if (angular.equals(card.author, selectedUser)) {
                        tempCards.push(card);
                    }
                });
                return tempCards;
            } else {
                return cards;
            }
        };
    }
})();