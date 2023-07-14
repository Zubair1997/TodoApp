let first = true;
let Bcount = -1;  //how much card in column B
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
        
        let sort = 0;
        let indexValue = newItemIndex;
        for (const ulId in locations) {
          const location = locations[ulId];
          //console.log(location);
          if(location.Class == hasClass ){
            if(location.columnIndex < newItemIndex) {
              location.columnIndex = sort++;
            }else if(location.columnIndex > newItemIndex){
              location.columnIndex = 2 + sort++;
            }else if(location.columnIndex == newItemIndex){
              indexValue = newItemIndex + 1;
              sort--;
            }
          }
        }    
        let locateObj = locationObjectCreate(displayTextId, ulId, indexValue, hasClass)
        locations[ulId] = locateObj;
      }else{
        first = true
      }
    }
  });
}


function displayName(ulId, name) {
  locations[ulId].TodoName = name;
  console.log(pages);
}

function onSort(ulId) {
    //https://sortablejs.github.io/Sortable/#grid
    var sortable = new Sortable(document.getElementById(ulId), {
      animation: 150,
      ghostClass: 'blue-background-class',
      onEnd: function (event) {
        var newOrder = Array.from(event.target.children).map(function (listItem) {
          return listItem.getAttribute("id"); //list-item ID
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
        
        //console.log(tasks);
        //console.log(pages);
        CalladdTaskHandler()
      }
    });
} 

function getItemById(itemId) {
  var $item = $("#" + itemId);

  var taskName = $item.find(".checkbox-container .list").val().trim();
  var taskId = $item.find("span").attr("id");

  var item = {
    liID: itemId,
    taskId: taskId,
    name: taskName,
  };

  return item;
}