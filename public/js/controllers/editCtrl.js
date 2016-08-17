(function(){
    'use strict';

    angular
        .module("bugs")
        .controller('EditCtrl', EditCtrl);

    function EditCtrl(currentBug, activities, $state, CurrentBoard, BoardFactory, ActivitiesFactory, LocalStorage){
        var edit = this;

        edit.board = CurrentBoard.getCurrentBoard();
        edit.bug = currentBug;
        edit.activities = activities;

        // Write a comment
        edit.comment = function(text){
            var author = JSON.parse(LocalStorage.getUserFromLS());
            edit.activities.commented.push({
                "author": author.username,
                "text": text,
                "date":   {$date: new Date().toISOString()}
            });
            ActivitiesFactory.update({ _id: edit.activities._id.$oid }, edit.activities);
        };

        // Update the bug
        edit.updateBug = function(bug){

            edit.bug = bug;
            var id = edit.board._id.$oid;
            BoardFactory.update({ _id: id }, edit.board);
            edit.message = "This bug is updated";

            setTimeout(function(){
                $state.go('dashboard', { boardID: id });
            }, 1500);
        };

        // Delete the bug
        edit.deleteBug = function(bug){
            var i = +bug.index.slice(0, 1);
            var index = edit.board.columns[i].bugs.indexOf(bug);
            edit.board.columns[i].bugs.splice(index, 1);

            BoardFactory.update({ _id: edit.board._id.$oid }, edit.board);

            setTimeout(function(){
                $state.go('dashboard', { boardID: edit.board._id.$oid });
            }, 1500);
        };
    }
})();