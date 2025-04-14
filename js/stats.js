import { getCompletedEvents, getCompledEventsByDate, getEventsByDate, getEventsThisWeek, getCompletedEventsThisWeek } from "./eventService.js";
import { getArrayOfWeek } from "./utils.js";

const numberOfCompletedEventsElement = document.getElementById("numberOfCompletedEvents");

export function getNumberOfCompletedEvents(){

    let contentHTML = "";
    let completedOverall = getCompletedEvents().length;
    contentHTML += `<p>Complete overall : ${completedOverall}</p>`;
    numberOfCompletedEventsElement.innerHTML=contentHTML;
    
    let completedToday = getCompledEventsByDate(new Date()).length;
    let toDoToday = (getEventsByDate(new Date()).length)+completedToday;
    contentHTML += `<p>Completed events today : ${completedToday}/${toDoToday}</p>`;
    numberOfCompletedEventsElement.innerHTML = contentHTML;

    getArrayOfWeek();
    contentHTML += `<p>Number of completed events this week : ${getCompletedEventsThisWeek(new Date()).length}/${getCompletedEventsThisWeek(new Date()).length+getEventsThisWeek(new Date()).length}</p>`;
    numberOfCompletedEventsElement.innerHTML = contentHTML;

}

getNumberOfCompletedEvents();