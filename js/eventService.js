import { dateToYMD, getArrayOfWeek } from "./utils.js";

export function getEvents() {
    return JSON.parse(localStorage.getItem("calendarEvents")) || [];
}
  
export function addEvent(event) {
    const events = getEvents();
    events.push(event);
    localStorage.setItem("calendarEvents", JSON.stringify(events));
}
  
export function deleteEventById(id) {
    const events = getEvents().filter(event => event.id != id);    
    localStorage.setItem("calendarEvents", JSON.stringify(events));
}

export function getEventsByDate(date){
    date = dateToYMD(date);
    const events = getEvents();
    const dailyEvents = events.filter(event=>event.date == date);
 
    return dailyEvents;

}

export function getEventByMonth(date){
    date = dateToYMD(date);
    const events = getEvents();
    const monthlyEvents = events.filter(event =>  event.date.split("-")[0] == date.split("-")[0] && event.date.split("-")[1] == date.split("-")[1]);
    return monthlyEvents;
}

export function getCompletedEvents(){
    return JSON.parse(localStorage.getItem("completedEvents")) || [];
}

export function getCompledEventsByDate(date){
    date = dateToYMD(date);
    const events = getCompletedEvents();
    const dateEvents = events.filter(event =>  event.date == date);
    return dateEvents;
}

export function addCompletedEvent(event){
    const events = getCompletedEvents();
    event.completedTime = dateToYMD(new Date());
    events.push(event);
    localStorage.setItem("completedEvents", JSON.stringify(events));
    deleteEventById(event.id);
}

export function getEventsThisWeek(date){
    date = new Date(date);
    const weekDates = getArrayOfWeek(date); 
    const events = getEvents();
  
    const eventsThisWeek = events.filter(event => 
      weekDates.includes(event.date)
    );
  
    return eventsThisWeek;
}

export function getCompletedEventsThisWeek(date){
    date = new Date(date);
    const weekDates = getArrayOfWeek(date); 
    const events = getCompletedEvents();
  
    const eventsThisWeek = events.filter(event => 
      weekDates.includes(event.date)
    );
  
    return eventsThisWeek;
}

//custom events
export function getEventsTypes(){
    return JSON.parse(localStorage.getItem("eventsTypes")) || [];
}

export function initEventTypes(){
    if(getEventsTypes().length == 0){
        const eventsTypes = getEventsTypes();
        let defaultValue = {name: "appointment", color:"lightcoral"};
        eventsTypes.push(defaultValue);
        defaultValue = {name : "task", color: "yellowgreen"};
        eventsTypes.push(defaultValue);
        defaultValue = {name : "meetup", color:"purple"}
        eventsTypes.push(defaultValue);
        defaultValue = {name : "work", color:"cornflowerblue"}
        eventsTypes.push(defaultValue);
        defaultValue = {name : "other", color:"lightgrey"};
        eventsTypes.push(defaultValue);
        localStorage.setItem("eventsTypes", JSON.stringify(eventsTypes));
    }
}

export function updateEventsTypeName(index, name){
    const eventsTypes = getEventsTypes();
    eventsTypes[index].name = name;
    

    localStorage.setItem("eventsTypes", JSON.stringify(eventsTypes));
}

export function updateEventsTypeColor(index, color){
    const eventsTypes = getEventsTypes();
    eventsTypes[index].color = color;

    localStorage.setItem("eventsTypes", JSON.stringify(eventsTypes));
}

