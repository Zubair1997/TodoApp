async function CallfetchTasksHandler(){
  try {
    await fetchTasksHandler();
  } catch (error) {
    console.log('Error:', error);
  }
}

const fetchTasksHandler = async () => {
  // try {
  //   const response = await fetch('https://project-301fd-default-rtdb.firebaseio.com/tasks.json');
  //   if (!response.ok) {
  //     throw new Error('Something went wrong!');
  //   }
  //   const data = await response.json();
  //   tasks = data;

  //   var key = null;
  //   for (const keys in data) {
  //     key = keys;
  //   }
  //   tasks = extractArrayObjects(data[key]);
  //   console.log(tasks);
  //   $(".card__total-tasks").text(tasks.length + " Tasks");
  //   for (const task of tasks) {
  //     addTask(task);
  //   }
  // } catch (error) {
  //   console.log('Error:', error);
  // }
};

function extractArrayObjects(obj) {
  //console.log(obj);
  return Object.values(obj);
}

async function CalladdTaskHandler(){
  try {
    await addTaskHandler(tasks);
  } catch (error) {
    console.log('Error:', error);
  }
}

const addTaskHandler = async (tasks) => {
  // try {
  //   const response = await fetch('https://project-301fd-default-rtdb.firebaseio.com/tasks/-NYxVz5uLIMqWEmtsNg3.json', {
  //     method: 'PUT',
  //     body: JSON.stringify(tasks),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // } catch (error) {
  //   console.log('Error:', error);
  // }
};

function getItemById(itemId) {
  var $item = $("#" + itemId);

  var taskName = $item.find(".checkbox-container").text().trim();
  //var checkboxId = $item.find("input[type='checkbox']").attr("id");
  var taskId = $item.find("span").attr("id");
  //console.log(taskId);

  var item = {
    liID: itemId,
    taskId: taskId,
    name: taskName,
    //checkboxId: checkboxId
  };

  return item;
}

function addTask(task, animation = null, ulId, card__totaltasks) {
  //console.log(tasks);
  var liID = generateRandomId(5);
  var checkboxid = liID + "Checkbox";
  var menuID = liID + "Menu";
  var inputId = liID + "Input";
  var labelId = liID + "Label";

  // var listItem = $("<li>", { id: liID }).append(
  //   $("<label>",  {id: labelId, class: "checkbox-container" }).append(
  //     $("<input>", {
  //       id: checkboxid,
  //       onclick: `changeBackground('${checkboxid}', '${liID}', '${task.id}', '${ulId}')`,
  //       type: "checkbox"
  //     }),
  //     $("<span>", { class: "checkmark", id: task.id }),
  //      task.name
  //   ),
  //   $("<div>", {
  //     id: menuID,
  //     onclick: `onSmallDiv('${menuID}', '${task.id}', '${liID}', '${labelId}', '${ulId}', '${card__totaltasks}')`,
  //     class: "menu"
  //   })
  // );

  var listItem = $("<li>", { id: liID }).append(
    $("<label>", { id: labelId, class: "checkbox-container" }).append(
      $("<input>", {
        id: checkboxid,
        onclick: `changeBackground('${checkboxid}', '${liID}', '${task.id}', '${ulId}')`,
        type: "checkbox",
      }),
      $("<span>", { class: "checkmark", id: task.id }),
      $("<input>", {class: "list", id: inputId,
        type: "text",
        value: task.name,
        onchange: `updateTaskName('${task.id}', '${ulId}', this.value)`,
      })
    ),
    $("<div>", {
      id: menuID,//deleteList(taskID, liID, ulId, card__totaltasks)
      onclick: `deleteList('${task.id}', '${liID}', '${ulId}', '${card__totaltasks}')`,
      class: "menu",
    })
  );

  if (animation === null) {
    $("#"+ulId).append(listItem);
  } else {
    $("#"+ulId).prepend(listItem);
    CalladdTaskHandler()
  }

  $('#'+liID).addClass(''+animation+'').delay(550).queue(function(next) {
    $('#'+liID).removeClass();  //animation class removed because delete animation was not working before.
    next();
  });

  if (task.status === 'completed') {
    $('#'+checkboxid).prop('checked', true);
    changeBackground(checkboxid, liID, task.id, ulId);
  }
}

function updateTaskName(taskID, ulId, newTaskName){
    //let newTaskName = $("#whiteDiv-Name").val();
    const taskIndex = tasks[ulId].findIndex(task => task.id === taskID);

    // If the task exists, update its name and insert it back into the array
    if (taskIndex !== -1 && tasks[ulId][taskIndex].name != newTaskName.trim()) {
      tasks[ulId][taskIndex].name = newTaskName;
      CalladdTaskHandler()
      //console.log(task.id + " Updated");
      //changeTaskNameInSpan(taskID, newTaskName, labelId, ulId);
    }
}   

function onMenuDiv(taskID, labelId, ulId) {
  $('.whiteDiv').html('');
  var whiteDiv = $("<div>", { class: "whiteDiv" });

  var whiteDivInfo = $("<div>", { class: "whiteDiv__info" }).appendTo(whiteDiv);
  $("<h2>").text("Name").appendTo(whiteDivInfo);
  $("<input>", { id: "whiteDiv-Name", type: "text" }).appendTo(whiteDivInfo);

  var whiteDivFooter = $("<div>", { class: "whiteDiv__footer" }).appendTo(whiteDiv);
  $("<button>", { class: "btn whiteDiv__cancel" }).text("Cancel").appendTo(whiteDivFooter);
  $("<button>", { class: "btn whiteDiv__save" }).text("Save").appendTo(whiteDivFooter);

  $(".whiteDiv").append(whiteDiv);

  //-----------------------
  $('.whiteDiv').css({
    opacity: 1,
    visibility: 'visible',
    transform: 'translate(-50%, -50%) scaleY(1)'
  });
  $('.whiteDivBackground').css('display', 'block');

  $(".whiteDivBackground").click(function() {
    closeWhiteDiv();
  });

  $(".whiteDiv__cancel").click(function() {
    closeWhiteDiv();
  });

 let task = tasks[ulId].find(task => task.id === taskID);
 $("#whiteDiv-Name").val(task.name);
 $(".whiteDiv__save").click(function() {
    let newTaskName = $("#whiteDiv-Name").val();
    const taskIndex = tasks[ulId].findIndex(task => task.id === taskID);

    // If the task exists, update its name and insert it back into the array
    if (taskIndex !== -1 && tasks[ulId][taskIndex].name != newTaskName.trim()) {
      tasks[ulId][taskIndex].name = newTaskName;
      CalladdTaskHandler()
      //console.log(task.id + " Updated");
      changeTaskNameInSpan(taskID, newTaskName, labelId, ulId);
    }
    closeWhiteDiv();
 });
}

function changeTaskNameInSpan(taskId, newName, labelId, ulId) {
  // const labelElement = $("#" + labelId);
  // labelElement.text(newName);
  // console.log(labelElement);
  // if (labelElement.length === 1) {
  //   labelElement.find("span.checkmark").text(newText);
  //   console.log(`Label text updated for ID: ${labelId}`);
  // } else {
  //   console.log(`Unable to find label with ID: ${labelId}`);
  // }
  changeShowList("All", ulId)
}

function closeWhiteDiv(){
  $('.whiteDiv').css({
    opacity: 0,
    visibility: 'hidden',
    transform: 'translate(-50%, -50%) scaleY(0)'
  });
  $('.whiteDivBackground').css('display', 'none');
}

let prepositionTop = null;
function onSmallDiv(menuID, taskID, liID, labelId, ulId, card__totaltasks) {
    console.log(menuID);
    var targetElement = $('#' + menuID);
    var smallDiv = $('#smallDiv');
    smallDiv.html('');
    $("#smallDiv").append(
        $("<ul>").append(
          $("<li>", { id: "smallDivEdit", text: "Edit" }),
          $("<li>", { id: "smallDivDelete", text: "Delete" })
        )
      );
    $('#smallDiv').addClass('smallDiv')
  
    var targetPosition = targetElement.offset();
  
    var smallDivTop = targetPosition.top + targetElement.outerHeight() + 10; 
    var smallDivLeft = (targetPosition.left) + 270;
            
    if (smallDiv.is(':visible') && (prepositionTop == smallDivTop || prepositionTop == null)) {
      smallDiv.hide();
      //smallDiv.html(''); // Clear out the contents of smallDiv
    } else {
      prepositionTop = smallDivTop;  
      smallDiv.css({ top: smallDivTop, left: smallDivLeft }).show();
    }
  
    $("#smallDivDelete").click(function() {
      deleteList(taskID, liID, ulId, card__totaltasks);
      $("#smallDiv").hide();
    });

    $("#smallDivEdit").click(function() {
        onMenuDiv(taskID, labelId, ulId);
        $("#smallDiv").hide();
    });
}  

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
}

function closeAboveDiv() {
  $('.whiteDiv').css({
    opacity: 0,
    visibility: 'hidden'
  });
  $('.whiteDivBackground').css('display', 'none');
}
  
function changeBackground(checkboxId, liID, taskId, ulId) {
  //console.log(tasks[ulId]);
  var checkbox = $("#" + checkboxId)[0];
  var listItem = $("#" + liID);
  //Status for checking if task.status == completed/active then do not reposition/change array
  //and do not reposition list.
  var beforeStatus = null;
  if (checkbox.checked) {
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
          if (tasks[ulId][i].status === 'completed') {
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
        CalladdTaskHandler()
      }
      //console.log(tasks);
    }
  } else {
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
      CalladdTaskHandler()
      //console.log(tasks);
    }
  }
}

function locationObjectCreate(name, ulId, indexValue, hasClass) {
  const locationObject = {
    ulId: ulId,
    TodoName: name,
    columnIndex: indexValue,
    Class: hasClass
  };
  return locationObject;
}

function taskObjectCreate(name, ulId=null) {
  const currentDate = new Date();
  const taskObject = {
    id: generateRandomId(8),
    name: '',
    ulId: ulId,
    status: 'active',
    date: currentDate.toLocaleDateString(),
    // duedate: currentDate.toLocaleDateString(),
    //subTasks: [taskObjectCreate]
  };
  taskObject.name = name;
  return taskObject;
}

function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

function getDate() {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var date = new Date();
  var day = days[date.getDay()];
  var month = months[date.getMonth()];
  var dayOfMonth = date.getDate();
  var year = date.getFullYear();

  var formattedDate = day + ' ' + month + ' ' + dayOfMonth + ' ' + year;
  return formattedDate;
}