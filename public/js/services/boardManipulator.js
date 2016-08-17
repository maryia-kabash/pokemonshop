(function(){
    'use strict';

    angular
        .module("bugs")
        .factory('BoardManipulator', BoardManipulator);

    function BoardManipulator(BoardFactory, ActivitiesFactory, CurrentBoard, LocalStorage){

        var currentBoard = CurrentBoard.getCurrentBoard();

        return {
            addColumn: function(board){
                BoardFactory.update({ _id: board._id.$oid }, board);
            },
            deleteBug: function(board, bug, i){
                var index = currentBoard.columns[i].bugs.indexOf(bug);
                currentBoard.columns[i].bugs.splice(index, 1);
                BoardFactory.update({ _id: board._id.$oid }, currentBoard);
            },
            sortOptions: {
                itemMoved: function (event) {

                    var source = event.source.itemScope;
                    var dest = event.dest.sortableScope;

                    var destIndex = source.modelValue.order = dest.$parent.column.order; // order of destination column
                    var parentIndex = source.sortableScope.$parent.$index; // order of previous column
                    var parentBugs = source.sortableScope.modelValue; // array of bugs in an updated previous column
                    var bugIndex = source.modelValue.index; // get moved bug index
                    var columnIndex = bugIndex.substring(0, 1);
                    var updatedIndex = bugIndex.replace(columnIndex, destIndex);
                    var destBugs = dest.modelValue; // array of bugs in an updated destination column

                    for (var j = 0; j < destBugs.length; j++) {
                        if (destBugs[j].index === bugIndex) {
                            var bug =  destBugs[j]; //get bug with index to be updated
                            bug.index = updatedIndex;
                        }
                    }

                    currentBoard.columns[parentIndex].bugs = parentBugs;
                    currentBoard.columns[destIndex].bugs = destBugs;

                    BoardFactory.update({ _id: currentBoard._id.$oid }, currentBoard);

                    //update activities collection
                    var activity = {
                        fo: true,
                        q: { boardId: currentBoard._id }
                    };
                    ActivitiesFactory.find(activity).$promise.then(function(data) {
                        var updatedActivity = data;
                        updatedActivity.moved.push({
                            "author": JSON.parse(LocalStorage.getUserFromLS()).username,
                            "date": {$date: new Date().toISOString()},
                            "fromColumn": parentIndex,
                            "toColumn": destIndex
                        });

                        ActivitiesFactory.update(activity, updatedActivity);
                    });

                },
                orderChanged: function (event) {
                    var orderedBugs = event.source.sortableScope.modelValue; // array of bugs
                    var orderedColumn = event.source.itemScope.modelValue.order = event.dest.sortableScope.$parent.column.order; // reordered column

                    var updatedBoard = main.board;
                    updatedBoard.columns[orderedColumn].bugs = orderedBugs;

                    BoardFactory.update({ _id: updatedBoard._id.$oid }, updatedBoard);
                },
                containment: '#board'
            }
        };
    }
})();