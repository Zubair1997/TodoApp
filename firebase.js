// let tasks = [
//     { id: "A", name: "Morning Walk", order: 0, status: 'active', date: "22/6/2023", duedate: "22/6/2023" },
//     { id: "AB", name: "Book Flight to Hungary", order: 0, status: 'active', date: "22/6/2023", duedate: "22/6/2023" }
//   ];

  




//////////////////////////////////////////////////
let first = true;
let Bcount = -1;
function columnSort() {
  $(".column").sortable({
    connectWith: ".column",
    handle: ".card__heading-2",
    placeholder: "portlet-placeholder ui-corner-all",
    update: function(event, ui) {
      if (first == true) {  //Func was running 2 times.
        first = false;
        const column = ui.item.closest(".column");
        const newItemIndex = ui.item.index();
  
        // Three column A/B/C
        let hasClass = "C";
        if (column.hasClass("A")) {
          hasClass = "A";
        } else if (column.hasClass("B")) {
          hasClass = "B";
        }

        const ulId = ui.item.closest(".card").find("ul").attr("id");
        const displayTextId = ui.item.closest(".card").find(".card__heading").val();

        $(".notesContainer").each(function() {
          const notesContainerCount = $(this).children().length;
          Bcount = notesContainerCount - 1;
        });
        locations[ulId].sort();
        if (Array.isArray(locations[ulId][1])) {
          locations[ulId][1].sort();
          //locations[ulId][2].sort();
        } 
        let sort = 0;
        let indexValue = newItemIndex;
        for (const ulId in locations) {
          const location = locations[ulId];
          //console.log(location);
          if(location[2] == hasClass ){
            if(location[1] < newItemIndex) {
              location[1] = sort++;
            }else if(location[1] > newItemIndex){
              location[1] = 2 + sort++;
            }else if(location[1] == newItemIndex){
              indexValue = newItemIndex + 1;
              sort--;
            }
          }
        }    
        // const totalElements = column.find(".card").length;
        // let changeValue = 0;
        // for (const ulId in locations) {
        //   const location = locations[ulId];
        //   if(location[2] == hasClass) {
        //     if(location[1] >= newItemIndex){
        //       let count = location[1]
        //       location[1] = ++count;
        //     }
        //     // && location[1] < totalElements-1  
        //     // }else if(location[1] >= totalElements-1){
        //     //   console.log("ELSE");
        //     //   location[1] = changeValue++;
        //     // }
        //   }
        // }
        
        locations[ulId][0] = displayTextId;
        locations[ulId][1] = indexValue;
        locations[ulId][2] = hasClass;
        console.log(locations);
        //console.log(displayTextId + " " + ulId + " " + newItemIndex + " " + hasClass);
      }else{
        first = true
      }
    }
  });
}


function displayName(ulId, name) {
  //console.log(ulId);
  locations[ulId][0] = name;
}

function onSort(ulId) {
    //https://sortablejs.github.io/Sortable/#grid
    var sortable = new Sortable(document.getElementById(ulId), {
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
        
        tasks[ulId].sort((a, b) => {
          let aIndex = newArray.findIndex(item => item.taskId === a.id);
          let bIndex = newArray.findIndex(item => item.taskId === b.id);
          return aIndex - bIndex;
        });
        
        console.log(tasks);
        CalladdTaskHandler()
      }
    });
}
  
// const cardEl = $("<div>").addClass("card").css("height", "5%");
      // const headingEl = $("<h1>").addClass("card__heading marGtop marGleft").text("Tue Jun 20 2023");
      // const subHeadingEl = $("<div>").addClass("card__sub-heading marGleft");
      // const totalTasksEl = $("<div>").addClass("card__total-tasks").attr("id", card__totaltasks).html("<span id=\"task-count\">0</span> tasks");
      // const statusEl = $("<div>").addClass("card__status")
      // const allStatusEl = $("<h3>").addClass("card__status--text activeSub").attr("id", card__statusAll).text("All");
      // const activeStatusEl = $("<h3>").addClass("card__status--text").attr("id", card__statusActive).text("Active");
      // const completedStatusEl = $("<h3>").addClass("card__status--text").attr("id", card__statusComplete).text("Completed");
      // const inputEl = $("<input>").attr("type", "text").attr("id", inputId).addClass("card__input").attr("placeholder", "Add a new task...");
      // const listEl = $("<ul>").attr("id", ulId);
  
      // subHeadingEl.append(totalTasksEl);
      // statusEl.append(allStatusEl, activeStatusEl, completedStatusEl);
      // subHeadingEl.append(statusEl);
      // cardEl.append(headingEl, subHeadingEl, inputEl, listEl);  