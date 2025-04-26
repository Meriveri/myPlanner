import { displayDLEvents } from "./deadlineEventHandler.js";

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

export function addTaskToDLEvent(id, name){
    const events = getDLEvents();
    const event = events.filter(e => e.id == id)[0];

    const task = {title : name, checked : "", completedOn : ""};


    event.checklist.push(task);
    localStorage.setItem("DLEvents", JSON.stringify(events));

}