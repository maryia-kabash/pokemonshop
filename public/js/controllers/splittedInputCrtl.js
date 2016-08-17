(function(){
    'use strict';

    angular
        .module("bugs")
        .controller('SplittedInputCrtl', SplittedInputCrtl);

    function SplittedInputCrtl($scope){
        var split = this;

        split.fields = [];

        split.registerField = function(field){
            split.fields.push(field);
        };

        split.focusNextField = function(currentField, newValue){
            var currentIndex = split.getIndexOfField(currentField);
            var nextField = split.fields[currentIndex + 1];

            if(nextField){
                if(newValue) {
                    nextField.val(newValue);
                }
                nextField[0].focus();
                if(!newValue) {
                    nextField.select();
                }
            }
        };

        split.focusPrevField = function(currentField){
            var currentIndex = split.getIndexOfField(currentField);
            var prevField = split.fields[currentIndex - 1];

            if(prevField) {
                prevField[0].focus();
            }
        };

        split.getIndexOfField = function(field){
            var index = split.fields.indexOf(field);

            if(index === -1){
                throw new Error('The field was not registered');
            } else {
                return index;
            }
        };

        split.collectData = function(){

            if(split.days === null || typeof split.days == 'undefined') split.days = 0;
            if(split.hours === null || typeof split.hours == 'undefined') split.hours = 0;
            if(split.minutes === null || typeof split.minutes == 'undefined') split.minutes = 0;

            var m = Math.floor(split.minutes/60);
            var h = Math.floor(split.hours/24);

            split.minutes -= 60*m;
            split.hours = (split.hours + m) - 24*h;
            split.days += h;

            split.time = [split.days, split.hours, split.minutes];

            var savedTime = $scope.edit.bug.time;
            if(savedTime){
                split.days += savedTime[0];
                split.hours += savedTime[1];
                split.minutes += savedTime[2];
            }

            $scope.edit.bug.time = [split.days, split.hours, split.minutes];
        };
    }
})();