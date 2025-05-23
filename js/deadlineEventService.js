import { dateToYMD } from "./utils.js";

export function getDLEvents(){
    return JSON.parse(localStorage.getItem("DLEvents")) || [];
}

export function addDLEvent(event){
    const events = getDLEvents();
    events.push(event);

    localStorage.setItem("DLEvents", JSON.stringify(events));

}

export function deleteAllDLEvents(){
    localStorage.removeItem("DLEvents");
}

export function completeDLEvent(id){
    const events = getDLEvents();
    const event = events.filter(e => e.id == id)[0];

    event.completed = true;

    localStorage.setItem("DLEvents", JSON.stringify(events));

    console.log(events);
}

export function addTaskToDLEvent(id, name){
    const events = getDLEvents();
    const event = events.filter(e => e.id == id)[0];

    const task = {title : name, checked : "", completedOn : ""};

    event.checklist.push(task);
    localStorage.setItem("DLEvents", JSON.stringify(events));
}

export function updateTask(id, index, status){
    const events = getDLEvents();
    const event = events.filter(e => e.id == id)[0];

    const checklist = event.checklist || [];

    if(status){
        checklist[index].checked="checked";
        checklist[index].completedOn=dateToYMD(new Date());
        localStorage.setItem("DLEvents", JSON.stringify(events));
        
    }
    else{
        checklist[index].checked="";
        checklist[index].completedOn="";
        localStorage.setItem("DLEvents", JSON.stringify(events));
    }
}


