(function(){
    'use strict';

    angular
        .module("bugs")
        .controller('CreateCtrl', CreateCtrl);

    function CreateCtrl($uibModalInstance, CreateManipulator, CurrentBoard, allBoards){
        var create = this;

        create.board = CurrentBoard.getCurrentBoard();
        create.bug = {};
        // Bootstrap Datepicker
        create.today = function() {
            create.bug.duedate = new Date();
        };
        create.today();
        create.clear = function() {
            create.bug.duedate = null;
        };
        create.disabled = function(date, mode) {
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };
        create.minDate = create.minDate ? null : new Date();
        create.maxDate = new Date(2020, 5, 22);
        create.open = function() {
            create.popup.opened = true;
        };
        create.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        create.popup = {opened: false};

        // Update the board with new bug (in the first column)
        if(create.board === null){
            create.boards = allBoards;
        }
        create.addNewCard = function(bug){
            CurrentBoard.setCurrentBoard(create.board);

            CreateManipulator.addNewCard(bug);

            setTimeout(function(){
                $uibModalInstance.close(bug);
            }, 1500);
        };

        // Create new board
        create.addNewBoard = function(board, columns){

            CreateManipulator.addNewBoard(board, columns);

            setTimeout(function(){
                $uibModalInstance.close(create.board);
            }, 1500);
        };

        // Add a column to a newly created board
        create.columns = [];
        create.addMoreColumns = function () {
            create.columns.push({
                name: "",
                bugs: [],
                order: ''
            });
        };

        create.dismiss = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();

