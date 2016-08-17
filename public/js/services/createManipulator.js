(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('CreateManipulator', CreateManipulator);

    function CreateManipulator(BoardFactory, ActivitiesFactory, CurrentBoard, LocalStorage){



        return {
            addNewCard: function(bug){
                var author = JSON.parse(LocalStorage.getUserFromLS());
                var currentBoard = CurrentBoard.getCurrentBoard();

                BoardFactory.find({ _id: currentBoard._id.$oid }).$promise.then(function(board) {

                    var bugIndex = 1;

                    //TODO wrong index after deleting a card
                    for (var i = 0; i < board.columns.length; i++) {
                        bugIndex += board.columns[i].bugs.length;
                    }

                    bug.index = "0."+bugIndex;
                    bug.duedate = bug.duedate.toISOString();
                    board.columns[0].bugs.push(bug);

                    BoardFactory.update({ _id: board._id.$oid }, board);

                    // create a new document in activities collection
                    var activity = {
                        "boardId": board._id,
                        "bugNumber": bugIndex.toString(),
                        "created": {
                            "author": author.username,
                            "date":   {$date: new Date().toISOString()}
                        },
                        "moved": [],
                        "commented": []
                    };
                    ActivitiesFactory.save(activity);
                });
            },
            addNewBoard: function(board, columns){
                // Remove empty fields
                var cleanColumns = [];
                for (var i = 0; i < columns.length; i++) {
                    if(columns[i].name.length > 0) {
                        cleanColumns.push(columns[i]);
                    }
                }
                board.columns = cleanColumns;

                BoardFactory.save(board);
            }
        };
    }
})();