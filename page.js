let tasks = {};
let locations = {}; //TodoName Column-Index Column-Name
let pages = {};
let pageName = "Default";


$(document).ready(function() {
    //Delete arr in page
    //local storage
    pages[pageName] = [];
    pages[pageName]["Locations"] = locations;
    pages[pageName]["Tasks"] = tasks;
    autoLoadPage("Default");
    const createBtnEl = $(".createBtn");
    
    createBtnEl.on("click", function() {
      //---  ID Start
      let id = generateRandomId(5);
      let inputId = id+"Input";
      let ulId = id+"List";
      let card__statusAll = id+"card__statusAll";
      let card__statusActive = id+"card__statusActive";
      let card__statusComplete = id+"card__statusComplete";
      let card__totaltasks = id+"card__total-tasks";
      let displayTextId = id+"displayTextId";
      let removecard = id+"removecard";
      tasks[ulId] = [];
      locations[ulId] = [];
      if ("tasks" in pages[pageName]) {
        //console.log("tasks property exists in pages[" + pageName + "]");
      } else {
        console.log("tasks property does not exist in pages[" + pageName + "]");
        //pages[pageName]["tasks"] = [];
        //pages[pageName]["locations"] = []
      }
      //---  ID End
      const cardEl = $("<div>").addClass("card").css("height", "5%").attr("id", id);
      const headEl = $("<div>").addClass("card__head");
      const headingInputEl = $("<input>").attr("placeholder", "Add a name").attr("type", "text").addClass("card__heading").attr("id", displayTextId);
      const heading2El = $("<div>").addClass("card__heading-2");
      var removeButton = $("<button>").addClass("remove").attr("id", removecard);
      var removeIcon = $("<i>").addClass("fa fa-remove");

      removeButton.append(removeIcon);
      heading2El.append(removeButton);
      const subHeadingEl = $("<div>").addClass("card__sub-heading marGleft");
      const totalTasksEl = $("<div>").addClass("card__total-tasks").attr("id", card__totaltasks).html("<span id=\"task-count\">0</span> tasks");
      const statusEl = $("<div>").addClass("card__status")
      const allStatusEl = $("<h3>").addClass("card__status--text activeSub").attr("id", card__statusAll).text("All");
      const activeStatusEl = $("<h3>").addClass("card__status--text").attr("id", card__statusActive).text("Active");
      const completedStatusEl = $("<h3>").addClass("card__status--text").attr("id", card__statusComplete).text("Completed");
      const inputEl = $("<input>").attr("type", "text").attr("id", inputId).addClass("card__input").attr("placeholder", "Add a new task...");
      const listEl = $("<ul>").attr("id", ulId);
  
      subHeadingEl.append(totalTasksEl);
      statusEl.append(allStatusEl, activeStatusEl, completedStatusEl);
      subHeadingEl.append(statusEl);
      headEl.append(headingInputEl, heading2El);
      cardEl.append(headEl, subHeadingEl, inputEl, listEl);

      headingInputEl.change(function() {
        displayName(ulId, $(this).val())
      });
  
      $(".notesContainer").append(cardEl);
      //console.log(tasks);

      $("#" + removecard).click(function() {
        $("#" + id).addClass('animateRemoveCard').delay(250).queue(function(next) {
          delete locations[ulId];
          delete tasks[ulId];
          //pages[pageName]["locations"] = locations;
          //pages[pageName]["tasks"] = tasks;
          $("#" + id).remove();
          next();
        });
      });

      //$(".card__heading").text(getDate());
      $("#" + displayTextId).val("Todo Task");
      //locations[ulId].push($("#" + displayTextId).val());
      Bcount++;
      //locations[ulId].push(Bcount);
      //locations[ulId].push("B");
      let locateObj = locationObjectCreate($("#" + displayTextId).val(), ulId, Bcount, "B")
      locations[ulId] = locateObj;
      //pages[pageName]["locations"] = locations;
      //console.log(pages);

      $("#"+inputId).on("keydown", function(event) {
        if (event.keyCode === 13 && $(this).val() !== "") {
          let taskName = $(this).val().trim();
          let objectTask = taskObjectCreate(taskName, ulId);
          $(".card__input").val("");
          tasks[ulId].push(objectTask);
          //pages[pageName]["tasks"] = tasks;
          //console.log(pages);
          let taskWord = (tasks[ulId].length <= 1) ? " Task" : " Tasks";
          $("#"+card__totaltasks).text(tasks[ulId].length + taskWord);
          addTask(objectTask, "animateClass", ulId, card__totaltasks);
        }
      });
      $('#'+card__statusAll+', #'+card__statusActive+', #'+card__statusComplete+'').click(function() {
        $('#'+card__statusAll+', #'+card__statusActive+', #'+card__statusComplete+'').removeClass('activeSub');
        $(this).addClass('activeSub');
        changeShowList($(this).text(), ulId);
      });
      columnSort(ulId, displayTextId)
      onSort(ulId);
    }); 

    //Page Add navigation__list--button
    let pageId = generateRandomId(5) + "Default";
    pageAdd("Default", pageId)
    //pageName = "Default";
    $("#"+pageId).addClass("active");
    
    $('.navigation__main--button').click(function() {
      var inputValue = $("#inValue").val();
      let pageId = generateRandomId(5) + inputValue
      if (inputValue !== "") {
        pageAdd(inputValue, pageId);
      }
    });

    //add page
    $(".navigation__main--input").on("keydown", function(event) {
      if (event.keyCode === 13 && $(this).val().trim() !== "") {
        let pageId = generateRandomId(5) + $(this).val();
        pageAdd($(this).val(), pageId)
      }
    })

    //change page
    $(".navigation__list").on("keydown", ".navigation__list--input", function(event) {
      let changeName = $(this).val();
      if (event.keyCode === 13 && pageName !== changeName) {
        pages[changeName] = pages[pageName];
        delete pages[pageName];
        pageName = changeName;
        // $(this).remove();
        // let pageId = generateRandomId(5) + changeName;
        // pageAdd(changeName, pageId)
        // console.log($(this));
      }
    });

    $('.navigation__list').on('click', '.navigation__list--item', function() {
      console.log($(this).find('.navigation__list--input').val());
      $('.navigation__list--item').removeClass('active');
      let clickedPage = $(this).find('.navigation__list--input').val();
      $('.createBtn').show()
      $(this).addClass('active');
      if(clickedPage != pageName) {
        pageName = clickedPage;
        removeAllCard();
        if (pages.hasOwnProperty(clickedPage)) {
          //console.log("IF exist");
          locations = pages[clickedPage]["Locations"];
          tasks = pages[clickedPage]["Tasks"];
          autoLoadPage(clickedPage);
        } else {
          //console.log("ELSE NotExist");
          tasks = [];
          locations = [];

          pages[clickedPage] = {};
          pages[clickedPage]["Locations"] = locations;
          pages[clickedPage]["Tasks"] = tasks;
        }
      }
    });
});

function removeAllCard() {
  $(".A").empty();
  $(".B").empty();
  $(".C").empty();
}


function pageAdd(inputValue, pageId) {
  var newItem = $('<div>').addClass('navigation__list--item').attr("id", pageId)
    .append(
      $('<input>').addClass('navigation__list--input').attr('type', 'text').val(inputValue),
      $('<button>').addClass('navigation__list--button').html('<i class="fa fa-remove"></i>')
      .on('click', function() {
        removePage(pageId, inputValue);
      })
    );

  $('.navigation__list').append(newItem);
  $('.navigation__main--input').val('');
}

function removePage(pageId, inputValue){
  console.log("inputValue: "+inputValue);
  $('#' + pageId).css('margin-bottom', '0px');
  if (inputValue == pageName) {
    //console.log("HAVE");
    $('.navigation__list--item').removeClass('active');
    removeAllCard();
  }
  $("#"+pageId).empty();
  delete pages[inputValue];
  if ($('.navigation__list--item').hasClass('active')) {
    //console.log('active present');
    $('.createBtn').show()
  }else {
    //console.log('not present');
    $('.createBtn').hide()
  }
 // console.log(pages);
}

function autoLoadPage(page) {
  //console.log("autoLoadPage "+ page);
  let location = pages[page]["Locations"];  //Locations => Class, TodoName, columnIndex, ulId
  let task = pages[page]["Tasks"]  //Tasks => id: '2srg4t6y', name: 'a1', status: 'active', ulId: 'qluI9List'      
  for(loc in location) {
    createCard(location[loc].Class, location[loc].TodoName, location[loc].columnIndex, location[loc].ulId, location[loc].taskName, task[loc].length);
  }

  var count = 0;
  for(tas in task) {
    for(i in task[tas]) {
      let objectTask = task[tas][i];
      addTask(objectTask, "animateClass", task[tas][i].ulId, 'card__totaltasks');
    }
  }
}

function createCard(Class, TodoName, columnIndex, ulId, taskName, listCount) {
  //console.log("listCount: "+listCount);
  let id = generateRandomId(5);
      let inputId = id+"Input";
      let card__statusAll = id+"card__statusAll";
      let card__statusActive = id+"card__statusActive";
      let card__statusComplete = id+"card__statusComplete";
      let card__totaltasks = id+"card__total-tasks";
      let displayTextId = id+"displayTextId";
      let removecard = id+"removecard";
      
      if (tasks.hasOwnProperty(ulId)) {
        // If tasks[ulId] already exists
        //console.log("No problem, it already exists.");
      } else if (!tasks.hasOwnProperty(ulId)) {
        // If tasks[ulId] doesn't exist
        tasks[ulId] = [];
        //console.log("Defined tasks[ulId] as an empty array.");
      }
      //---  ID End
      const cardEl = $("<div>").addClass("card").css("height", "5%").attr("id", id);  //css("height", "5%") => to resize card after deleting list
      const headEl = $("<div>").addClass("card__head");
      const headingInputEl = $("<input>").attr("placeholder", "Add a name").attr("type", "text").addClass("card__heading").attr("id", displayTextId);
      const heading2El = $("<div>").addClass("card__heading-2");
      var removeButton = $("<button>").addClass("remove").attr("id", removecard);
      var removeIcon = $("<i>").addClass("fa fa-remove");

      removeButton.append(removeIcon);
      heading2El.append(removeButton);
      const subHeadingEl = $("<div>").addClass("card__sub-heading marGleft");
      const totalTasksEl = $("<div>").addClass("card__total-tasks").attr("id", card__totaltasks).html("<span id=\"task-count\">0</span> tasks");
      const statusEl = $("<div>").addClass("card__status")
      const allStatusEl = $("<h3>").addClass("card__status--text activeSub").attr("id", card__statusAll).text("All");
      const activeStatusEl = $("<h3>").addClass("card__status--text").attr("id", card__statusActive).text("Active");
      const completedStatusEl = $("<h3>").addClass("card__status--text").attr("id", card__statusComplete).text("Completed");
      const inputEl = $("<input>").attr("type", "text").attr("id", inputId).addClass("card__input").attr("placeholder", "Add a new task...");
      const listEl = $("<ul>").attr("id", ulId);
  
      subHeadingEl.append(totalTasksEl);
      statusEl.append(allStatusEl, activeStatusEl, completedStatusEl);
      subHeadingEl.append(statusEl);
      headEl.append(headingInputEl, heading2El);
      cardEl.append(headEl, subHeadingEl, inputEl, listEl);

      headingInputEl.change(function() {
        displayName(ulId, $(this).val())
      });
  
      $("."+Class).append(cardEl);
      if(Class == "B"){
        Bcount++;
      }

      $("#" + removecard).click(function() {
        $("#" + id).addClass('animateRemoveCard').delay(250).queue(function(next) {
          delete locations[ulId];
          delete tasks[ulId];
          $("#" + id).remove();
          next();
        });
      });
      
      $("#" + displayTextId).val(TodoName);
      let locateObj = locationObjectCreate($("#" + displayTextId).val(), ulId, Bcount, Class)
      locations[ulId] = locateObj;
      //console.log(pages);

      let count = 0;
      let taskWord = (tasks[ulId].length <= 1) ? " Task" : " Tasks";
      $("#"+card__totaltasks).text((listCount + count++) + taskWord);
      $("#"+inputId).on("keydown", function(event) {
        if (event.keyCode === 13 && $(this).val().trim() !== "") {
          let taskName = $(this).val().trim();
          let objectTask = taskObjectCreate(taskName, ulId);
          $(".card__input").val("");
          tasks[ulId].push(objectTask);
          //console.log(pages);
          let taskWord = (tasks[ulId].length <= 1) ? " Task" : " Tasks";
          $("#"+card__totaltasks).text((listCount + count++) + taskWord);
          addTask(objectTask, "animateClass", ulId, card__totaltasks);
        }
      });
      $('#'+card__statusAll+', #'+card__statusActive+', #'+card__statusComplete+'').click(function() {
        $('#'+card__statusAll+', #'+card__statusActive+', #'+card__statusComplete+'').removeClass('activeSub');
        $(this).addClass('activeSub');
        changeShowList($(this).text(), ulId);
      });
      columnSort(ulId, displayTextId)
      onSort(ulId);
}