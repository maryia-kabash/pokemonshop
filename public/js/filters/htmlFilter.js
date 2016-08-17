(function(){
    'use strict';

    angular
        .module("bugs")
        .filter('HtmlFilter', HtmlFilter);

    function HtmlFilter($sce){

        return function(val) {
            return $sce.trustAsHtml(val);
        };

    }
})();