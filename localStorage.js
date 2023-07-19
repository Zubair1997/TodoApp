function setLocalStorage() {
    console.log("SET-STORAGE: "+pageName);
    let taskKey = pageName+"task"
    let locationKey = pageName+"location"
    let t_ask = [];
    let l_cation = [];
    for(id in pages[pageName]["Tasks"]) {
        t_ask.push(pages[pageName]["Tasks"][id])
    }
    for(id in pages[pageName]["Locations"]) {
        l_cation.push(pages[pageName]["Locations"][id])
    }
    localStorage.setItem(storageKey, JSON.stringify(pages));
    localStorage.setItem(taskKey, JSON.stringify(t_ask));
    localStorage.setItem(locationKey, JSON.stringify(l_cation));
}

function getLocalStorage() {
    //localStorage.clear(); 
    let activeId = false;
    let data = localStorage.getItem(storageKey);
    pages = JSON.parse(data);
    
    if(pages != null) {
        for (pagename in pages) {
            let taskKey = pagename+"task";
            let locationKey = pagename+"location";

            let nestedData = localStorage.getItem(taskKey);
            let nestTask = JSON.parse(nestedData);
            pages[pagename]["Tasks"] = nestTask;
            //tasks = pages[pagename]["Tasks"];
            let nestedData2 = localStorage.getItem(locationKey);
            let nestLocation = JSON.parse(nestedData2);
            //locations = pages[pagename]["Locations"];
            pages[pagename]["Tasks"] = [];

            for(name in nestTask) {
                if(nestTask[name].length > 0) {
                    pages[pagename]["Tasks"][nestTask[name][0].ulId] = nestTask[name];
                }
            }

            for(name in nestLocation) {
                pages[pagename]["Locations"][nestLocation[name].ulId] = nestLocation[name];
            }

            let pageId = generateRandomId(5) + pagename;
            pageAdd(pagename, pageId);
            if(activeId == false){
                activeId = pageId;
                $("#"+activeId).addClass("active");
                pageName = pagename;
                autoLoadPage(pagename);
                tasks = pages[pagename]["Tasks"];
                locations = pages[pagename]["Locations"];
            }
            //console.log(pages[pagename]["Tasks"]);
        }   
    }else {
        pages = {};
        // pages[pageName] = [];
        // pages[pageName]["Locations"] = locations;
        // pages[pageName]["Tasks"] = tasks;
    }
}