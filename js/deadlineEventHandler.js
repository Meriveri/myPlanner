import {getDLEvents, addDLEvent, deleteAllDLEvents} from './deadlineEventService.js'

export function displayDLEvents(){
    let DLEvents = getDLEvents();
    DLEvents = DLEvents.filter(e => e.archive == false);
}

const e ={
    id : "DL-0", 
    title : "read 1 book a month",
    dueDate : "2025-12-31", 
    checklist : [{title : "book 1", checked : true, completedOn : "2025-01-16"}, {title : "book 2", checked : false, completedOn : ""}]
};

let DLEvents = getDLEvents();
addDLEvent(e);
displayDLEvents();
//deleteAllDLEvents();
console.log(DLEvents);