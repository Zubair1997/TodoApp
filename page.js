let tasks = {};
let locations = {}; //TodoName Column-Index Column-Name
let pages = {};
// const data = {
//     default: [],
//     locations: [
//       ["A", 0, "A"],
//       ["B", 1, "B"],
//       ["C", 0, "C"],
//       ["D", 1, "B"]
//     ],
//     tasks: [
//       [
//         { id: "A1uFQVXn", name: "b1", status: "active", ... },
//         { id: "nQylcSvr", name: "b2", status: "active", ... }
//       ],
//       [
//         { id: "8suqKrcF", name: "c2", status: "active", ... },
//         { id: "HWlaBw3Z", name: "c1", status: "active", ... }
//       ],
//       []
//     ]
//   };
$(document).ready(function() {
    // 1) When card delete remove tasks & location in array
    // 2) Insert ulId in location
    pages["default"] = [];
    pages["default"]["tasks"] = [];
    pages["default"]["locations"] = [];
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
      //packBoth["default"].push(tasks[ulId]);
      //packBoth["default"].push(locations[ulId]);
      pages["default"]["tasks"].push(tasks[ulId]);
      pages["default"]["locations"].push(locations[ulId]);
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
          pages["default"]["locations"] = locations;
          $("#" + id).remove();
          next();
        });
      });

      //$(".card__heading").text(getDate());
      $("#" + displayTextId).val("Todo Task");
      locations[ulId].push($("#" + displayTextId).val());
      Bcount++;
      locations[ulId].push(Bcount);
      locations[ulId].push("B");
      //console.log(locations);

      $("#"+inputId).on("keydown", function(event) {
        if (event.keyCode === 13 && $(this).val() !== "") {
          let taskName = $(this).val().trim();
          let objectTask = taskObjectCreate(taskName, ulId);
          $(".card__input").val("");
          tasks[ulId].unshift(objectTask);
          console.log(pages);
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
});