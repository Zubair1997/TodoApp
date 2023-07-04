let taskCount = 0;
// let tasks = [
//   { id: "A", name: "Morning Walk", order: 0, status: 'active', date: "22/6/2023", duedate: "22/6/2023" },
//   { id: "AB", name: "Book Flight to Hungary", order: 0, status: 'active', date: "22/6/2023", duedate: "22/6/2023" },
//   { id: "ABC", name: "Meeting with Holden Caulfield", order: 0, status: 'active', date: "22/6/2023", duedate: "22/6/2023" },
//   { id: "ABCD", name: "Blog about CSS box model", order: 0, status: 'active', date: "22/6/2023", duedate: "22/6/2023" }
// ];
let tasks = [];
$(document).ready(function() {
  CallfetchTasksHandler()
  $(".card__heading").text(getDate());
  $(".card__input").on("keydown", function(event) {
    if (event.keyCode === 13 && $(this).val() !== "") {
      let taskName = $(this).val().trim();
      let objectTask = taskObjectCreate(taskName);
      $(".card__input").val("");
      tasks.unshift(objectTask);
      let taskWord = (tasks.length <= 1) ? " Task" : " Tasks";
      $(".card__total-tasks").text(tasks.length + taskWord);
      addTask(objectTask, "animateClass");
    }
  });
  $('.card__status--text').click(function() {
    $('.card__status--text').removeClass('activeSub');
    $(this).addClass('activeSub');
    changeShowList($(this).text());
  });
  onSort();
});

function onSort() {
  //https://sortablejs.github.io/Sortable/#grid
  var sortable = new Sortable(document.getElementById("list"), {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: function (event) {
      var newOrder = Array.from(event.target.children).map(function (listItem) {
        return listItem.getAttribute("id");
      });

      console.log('New order:', newOrder);
      // Save the new order or perform any necessary actions

      var newArray  = newOrder.map(function (itemId) {
        return getItemById(itemId);
      });

      console.log('Updated items:', newArray );
      
      tasks.sort((a, b) => {
        let aIndex = newArray.findIndex(item => item.taskId === a.id);
        let bIndex = newArray.findIndex(item => item.taskId === b.id);
        return aIndex - bIndex;
      });
      
      console.log(tasks);
      CalladdTaskHandler()
    }
  });
}

async function CallfetchTasksHandler(){
  try {
    await fetchTasksHandler();
  } catch (error) {
    console.log('Error:', error);
  }
}

const fetchTasksHandler = async () => {
  try {
    const response = await fetch('https://project-301fd-default-rtdb.firebaseio.com/tasks.json');
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const data = await response.json();
    tasks = data;

    var key = null;
    for (const keys in data) {
      key = keys;
    }
    tasks = extractArrayObjects(data[key]);
    console.log(tasks);
    $(".card__total-tasks").text(tasks.length + " Tasks");
    for (const task of tasks) {
      addTask(task);
    }
  } catch (error) {
    console.log('Error:', error);
  }
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
  try {
    const response = await fetch('https://project-301fd-default-rtdb.firebaseio.com/tasks/-NYxVz5uLIMqWEmtsNg3.json', {
      method: 'PUT',
      body: JSON.stringify(tasks),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log('Error:', error);
  }
};

function getItemById(itemId) {
  var $item = $("#" + itemId);

  var taskName = $item.find(".checkbox-container").text().trim();
  //var checkboxId = $item.find("input[type='checkbox']").attr("id");
  var taskId = $item.find("span").attr("id");
  console.log(taskId);

  var item = {
    liID: itemId,
    taskId: taskId,
    name: taskName,
    //checkboxId: checkboxId
  };

  return item;
}

function addTask(task, animation = null) {
  var liID = generateRandomId(5);
  var checkboxid = liID + "Checkbox";
  var menuID = liID + "Menu";
  var smallDiv = liID + "SmallDiv";
  var labelId = liID + "Label";

  var listItem = $("<li>", { id: liID }).append(
    $("<label>",  {id: labelId, class: "checkbox-container" }).append(
      $("<input>", {
        id: checkboxid,
        onclick: `changeBackground('${checkboxid}', '${liID}', '${task.id}')`,
        type: "checkbox"
      }),
      $("<span>", { class: "checkmark", id: task.id }),
      task.name
    ),
    $("<div>", {
      id: menuID,
      onclick: `onSmallDiv('${menuID}', '${task.id}', '${liID}', '${labelId}')`,
      class: "menu"
    })
  );

  if (animation === null) {
    $("#list").append(listItem);
  } else {
    $("#list").prepend(listItem);
    CalladdTaskHandler()
  }

  $('#'+liID).addClass(''+animation+'').delay(550).queue(function(next) {
    $('#'+liID).removeClass();  //animation class removed because delete animation was not working before.
    next();
  });

  if (task.status === 'completed') {
    $('#'+checkboxid).prop('checked', true);
    changeBackground(checkboxid, liID, task.id);
  }
}

function onMenuDiv(taskID, labelId) {
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

 let task = tasks.find(task => task.id === taskID);
 $("#whiteDiv-Name").val(task.name);
 $(".whiteDiv__save").click(function() {
    let newTaskName = $("#whiteDiv-Name").val();
    const taskIndex = tasks.findIndex(task => task.id === taskID);

    // If the task exists, update its name and insert it back into the array
    if (taskIndex !== -1 && tasks[taskIndex].name != newTaskName.trim()) {
      tasks[taskIndex].name = newTaskName;
      CalladdTaskHandler()
      //console.log(task.id + " Updated");
      changeTaskNameInSpan(taskID, newTaskName, labelId);
    }
    closeWhiteDiv();
 });
}

function changeTaskNameInSpan(taskId, newName, labelId) {
  // const labelElement = $("#" + labelId);
  // labelElement.text(newName);
  // console.log(labelElement);
  // if (labelElement.length === 1) {
  //   labelElement.find("span.checkmark").text(newText);
  //   console.log(`Label text updated for ID: ${labelId}`);
  // } else {
  //   console.log(`Unable to find label with ID: ${labelId}`);
  // }
  changeShowList("All")
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
function onSmallDiv(menuID, taskID, liID, labelId) {
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
    var smallDivLeft = 773.38330078125 + 200;
            
    if (smallDiv.is(':visible') && (prepositionTop == smallDivTop || prepositionTop == null)) {
      smallDiv.hide();
      //smallDiv.html(''); // Clear out the contents of smallDiv
    } else {
      prepositionTop = smallDivTop;  
      smallDiv.css({ top: smallDivTop, left: smallDivLeft }).show();
    }
  
    $("#smallDivDelete").click(function() {
      deleteList(taskID, liID);
      $("#smallDiv").hide();
    });

    $("#smallDivEdit").click(function() {
        onMenuDiv(taskID, labelId);
        $("#smallDiv").hide();
    });
}  

function changeShowList(display) {
  $("#list").empty();
  if (display === "All") {
    for (const task of tasks) {
      addTask(task);
    }
  } else if (display === "Active") {
    for (const task of tasks) {
      if (task.status == 'active') {
        addTask(task);
      }
    }
  } else if (display === "Completed") {
    for (const task of tasks) {
      if (task.status == 'completed') {
        addTask(task);
      }
    }
  }
}

function deleteList(taskId, liId) {
  $('#'+liId).addClass('animateClassReverse').delay(470).queue(function(next) {
    $(this).remove();
    next();
  });
  tasks = $.grep(tasks, function(task) {
    return task.id !== taskId;
  });
  let taskWord = (tasks.length <= 1) ? " Task" : " Tasks";
  $(".card__total-tasks").text(tasks.length + taskWord);
  CalladdTaskHandler();
}

function closeAboveDiv() {
  $('.whiteDiv').css({
    opacity: 0,
    visibility: 'hidden'
  });
  $('.whiteDivBackground').css('display', 'none');
}
  
function changeBackground(checkboxId, liID, taskId) {
  var checkbox = $("#" + checkboxId)[0];
  var listItem = $("#" + liID);
  //Status for checking if task.status == completed/active then do not reposition/change array
  //and do not reposition list.
  var beforeStatus = null;
  if (checkbox.checked) {
    $.each(tasks, function(index, task) {
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
      const index = tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        const element = tasks.splice(index, 1)[0];
        let lastCompleteIndex = -1;
        for (let i = tasks.length - 1; i >= 0; i--) {
          if (tasks[i].status === 'completed') {
            lastCompleteIndex = i;
          } else {
            break;
          }
        }
        if (lastCompleteIndex !== -1) {
          // Move the list item to the last position
          listItem.parent().children().eq(lastCompleteIndex).after(listItem)
          tasks.splice(lastCompleteIndex, 0, element);
        } else {
          listItem.appendTo(listItem.parent());
          tasks.push(element);
        }
        CalladdTaskHandler()
      }
      //console.log(tasks);
    }
  } else {
    $.each(tasks, function(index, task) {
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
      const index = tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        const element = tasks.splice(index, 1)[0];
        tasks.unshift(element);
      }
      CalladdTaskHandler()
      //console.log(tasks);
    }
  }
}

function taskObjectCreate(name) {
  const currentDate = new Date();
  const taskObject = {
    id: generateRandomId(8),
    name: '',
    //order: 0,
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