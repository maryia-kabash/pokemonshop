(function(){
    'use strict';

    angular
        .module("bugs")
        .filter('PriorityFilter', PriorityFilter);

    function PriorityFilter(){

        return function (cards, selectedPriority) {
            //if (cards.length > 0 && selectedPriority ) {
            if ( selectedPriority ) {
                var tempCards = [];

                var elem =  angular.element(document.getElementsByClassName(selectedPriority));
                var elems =  angular.element(document.querySelectorAll(".priority"));
                elems.removeClass("btn-info");
                elem.addClass("btn-info");

                angular.forEach(cards, function (card) {
                    if (angular.equals(card.priority, selectedPriority)) {
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