function changeShowList(display, ulId) {
    $("#"+ulId).empty();
    if (display === "All") {
        for (const task of tasks[ulId]) {
            addTask(task, null, ulId);
        }
    } else if (display === "Active") {
        for (const task of tasks[ulId]) {
            if (task.status == 'active') {
                addTask(task, null, ulId);
            }
        }
    } else if (display === "Completed") {
        for (const task of tasks[ulId]) {
            if (task.status == 'completed') {
                addTask(task, null, ulId);
            }
        }
    }
}
  
function deleteList(taskId, liId, ulId, card__totaltasks) {
    $('#'+liId).addClass('animateClassReverse').delay(470).queue(function(next) {
        $(this).remove();
        next();
    });
    tasks[ulId] = $.grep(tasks[ulId], function(task) {
        return task.id !== taskId;
    });
    let taskWord = (tasks[ulId].length <= 1) ? " Task" : " Tasks";
    $("#"+card__totaltasks).text(tasks[ulId].length + taskWord);
    CalladdTaskHandler();
    setLocalStorage();
}

function changeBackground(checkboxId, liID, taskId, ulId) {
//console.log(tasks[ulId]);
var checkbox = $("#" + checkboxId)[0];
var listItem = $("#" + liID);
//Status for checking if task.status == completed/active then do not re-position/change array
//and do not reposition list.
var beforeStatus = null;
if (checkbox.checked) {
    //console.log("INHERE");
    //console.log(tasks[ulId]);
    $.each(tasks[ulId], function(index, task) {
    if (task.id === taskId && task.status != "completed") {
        beforeStatus = "active"
        task.status = "completed";
        return false;
    }else{
        beforeStatus = "completed"
    }
    });

    listItem.css("background-color", "#dbffdb");
    listItem.hover(
    function() {
        $(this).css("background-color", "rgb(185, 255, 185)");
    },
    function() {
        $(this).css("background-color", "#dbffdb");
    }
    );
    
    if(beforeStatus != "completed"){
    //Shifting the element to last in task array
    const index = tasks[ulId].findIndex(task => task.id === taskId);
    if (index !== -1) {
        const element = tasks[ulId].splice(index, 1)[0];
        let lastCompleteIndex = -1;
        for (let i = tasks[ulId].length - 1; i >= 0; i--) {
        if (tasks[ulId][i].status === 'completed') {  //Shifting just above checked list
            lastCompleteIndex = i;
        } else {
            break;
        }
        }
        if (lastCompleteIndex !== -1) {
        // Move the list item to the last position
        listItem.parent().children().eq(lastCompleteIndex).after(listItem)
        tasks[ulId].splice(lastCompleteIndex, 0, element);
        } else {
        listItem.appendTo(listItem.parent());
        tasks[ulId].push(element);
        }
        CalladdTaskHandler();
        setLocalStorage();
    }
    //console.log(tasks);
    }
} else {
    //Removing from checked and moving to top
    $.each(tasks[ulId], function(index, task) {
    if (task.id === taskId && task.status != "active") {
        beforeStatus = "completed"
        task.status = "active";
        return false;
    }else{
        beforeStatus = "active"
    }
    });

    listItem.css("background-color", "#fff");
    listItem.hover(
    function() {
        $(this).css("background-color", "#f6fbff");
    },
    function() {
        $(this).css("background-color", "#fff");
    }
    );

    if(beforeStatus != "active"){
    listItem.prependTo(listItem.parent());
    //Shifting the element to first in task array
    const index = tasks[ulId].findIndex(task => task.id === taskId);
    if (index !== -1) {
        const element = tasks[ulId].splice(index, 1)[0];
        tasks[ulId].unshift(element);
    }
    CalladdTaskHandler();
    setLocalStorage();
    //console.log(tasks);
    }
}
}  