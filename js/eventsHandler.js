import { deleteEventById, getEvents, addEvent, getCompletedEvents, addCompletedEvent } from './eventService.js';  
import './main.js';
import { renderPage } from './dayDisplay.js'
import { putDaysWithEventsInBold } from './main.js';
import { dateToYMD, getDayDifference } from './utils.js';

const newEventBtn = document.getElementById("newEvent");
const formElement = document.getElementById("eventForm");

const addEventBtn = document.getElementById("addEvent");
const delEventsBtn = document.getElementById("delEvents");

const upcomingEventsElement = document.getElementById("upcomingEvents");

export function isEventLate(event){
    let eventDate = new Date(event.date);
    let today = new Date();
    if(Math.trunc(getDayDifference(eventDate, today))>0){return `<span class="borderBubble">late</span>`}
    return "";
}

export function showEvents() {
    upcomingEventsElement.innerHTML = "";
    let events = getEvents();
    
    for(let i = 0; i < events.length;i++){
        upcomingEventsElement.innerHTML += `<div class="event ${events[i].type}"><span class="eventItem"><button class="eventComplete" data-id="${events[i].id}">✔</button></span>
        <div class="eventInfos">
            <div class="eventTitle">${events[i].name} ${isEventLate(events[i])}</div><br/>
            <div class="eventDate">${events[i].date} ${events[i].time}</div>
        </div>
        <button class="eventDelete" data-id="${events[i].id}">✘</button></div>`;
    } 


    if(events.length==0){
     upcomingEventsElement.classList.add("hidden");
     delEventsBtn.classList.add("hidden");
     upcomingEventsElement.classList.remove("visible");
    }
    else{
        upcomingEventsElement.classList.add("visible");
        delEventsBtn.classList.add("visible");
        upcomingEventsElement.classList.remove("hidden");     
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    showEvents();
  });

upcomingEventsElement.addEventListener('onload', ()=>{showEvents();});
newEventBtn.addEventListener('click', () => {
    formElement.classList.toggle("visible");  
});

export function createEvent() {
    let eventID = Date.now();
    let eventName = setDefaultEventNameValues();
    let eventDay = setDefaultEventDayValues();
    let eventTimeElement = document.getElementById("eventTime");
    let eventTime = eventTimeElement.value;
    let eventTypeElement = document.getElementById("eventType");
    let eventType = eventTypeElement.value;

    const eventInfo = {
        id: eventID,
        name: eventName,
        date: eventDay,
        time: eventTime,
        type: eventType, 
        completedTime: ""
    };
    
    addEvent(eventInfo);
    
    showEvents();
    upcomingEventsElement.classList.add("visible");
    delEventsBtn.classList.add("visible");
    delEventsBtn.classList.remove("hidden");


}

addEventBtn.addEventListener('click', () =>{
    createEvent(); 
    let events = getEvents();
    putDaysWithEventsInBold();
    renderPage(new Date(events[events.length-1].date), events.filter(event => event.date == events[events.length-1].date));
})

const setDefaultEventDayValues = () =>{
    let date = document.getElementById("eventDay").value;
    let today = new Date(); 
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth()+1;
    let currentDay = today.getDate();
    
    if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
    if (currentDay < 10) { currentDay = '0' + currentDay; }
    
    let thisDate = `${currentYear}-${currentMonth}-${currentDay}`;
    if(date == ""){date= thisDate; return thisDate;}
    else{return date;}
        
} 
const setDefaultEventNameValues = () =>{
    let name = document.getElementById("eventName").value; 
    if(name == "" ){name = "untitled event "; return name;}
    else{return name;}
}

delEventsBtn.addEventListener('click', () =>{
    //localStorage.removeItem("calendarEvents");
    //localStorage.removeItem("completedEvents");
    //localStorage.removeItem("habits");
    localStorage.removeItem("DLEvents");
    putDaysWithEventsInBold();
    showEvents();
    upcomingEventsElement.classList.add("hidden");
});

upcomingEventsElement.addEventListener('click', (btn)=>{
    if(btn.target.classList.contains("eventDelete")){
        const id = btn.target.dataset.id;
        deleteEventById(id);
        let events = getEvents();
        showEvents();
        putDaysWithEventsInBold();
        renderPage(new Date(),events);
    }

    if(btn.target.classList.contains("eventComplete")){
        let events = getEvents();
        const id = btn.target.dataset.id;
        events = events.filter(event => event.id == id);
        addCompletedEvent(events[0]);
        showEvents();
        putDaysWithEventsInBold();
        renderPage(new Date(), getEvents());
        console.log("archived ", getCompletedEvents())
    }
})



