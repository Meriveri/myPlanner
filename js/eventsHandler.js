import { deleteEventById, getEvents, addEvent, getCompletedEvents, addCompletedEvent, getEventsTypes, initEventTypes } from './eventService.js';  
import './main.js';
import { renderPage } from './dayDisplay.js'
import { putDaysWithEventsInBold } from './main.js';
import { dateToYMD, getDayDifference } from './utils.js';
import { updatePoints } from './gatchaService.js';
import { displayPoints } from './gatchaHandler.js';


const newEventBtn = document.getElementById("newEvent");
const formElement = document.getElementById("eventForm");

const addEventBtn = document.getElementById("addEvent");
const delEventsBtn = document.getElementById("delEvents");

const upcomingEventsElement = document.getElementById("upcomingEvents");

const eventTypeElement = document.getElementById("eventType");

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
    changeEventsBackgroundColor();
    
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
    let eventName = document.getElementById("eventName").value; 
    let eventDay = dateToYMD(document.getElementById("eventDay").value);
    let eventTimeElement = document.getElementById("eventTime");
    let eventTime = eventTimeElement.value;
    let eventTypeElement = document.getElementById("eventType");
    let eventType = eventTypeElement.value;

    console.log(eventDay);

    if(eventName != "" && eventDay != "Invalid Date"){
        const eventInfo = {
        id: eventID,
        name: eventName,
        date: eventDay,
        time: eventTime,
        type: eventType, 
        completedTime: ""
        };
    addEvent(eventInfo);
    }
    else{
        document.getElementById("eventDay").classList.remove("invalidField"); 
        document.getElementById("eventName").classList.remove("invalidField");
        if(eventName == ""){ document.getElementById("eventName").classList.add("invalidField");}
        if(eventDay == "Invalid Date"){document.getElementById("eventDay").classList.add("invalidField");}
    }
    
    showEvents();


}

addEventBtn.addEventListener('click', () =>{
    createEvent(); 
    let events = getEvents();
    putDaysWithEventsInBold();
    renderPage(new Date(events[events.length-1].date), events.filter(event => event.date == events[events.length-1].date));
})

delEventsBtn.addEventListener('click', () =>{
    //localStorage.removeItem("calendarEvents");
    //localStorage.removeItem("completedEvents");
    //localStorage.removeItem("habits");
    //localStorage.removeItem("DLEvents");
    //localStorage.removeItem("points");
    //localStorage.removeItem("eventsTypes");
    putDaysWithEventsInBold();
    showEvents();
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
        updatePoints(15);
        showEvents();
        displayPoints();
        putDaysWithEventsInBold();
        renderPage(new Date(), getEvents());
    }
})


export function displayEventTypes(){
    initEventTypes();
    const eventsTypes = getEventsTypes();
    for(let i = 0; i<eventsTypes.length;i++){
        eventTypeElement.innerHTML+=`<option value="eventType${i+1}">${eventsTypes[i].name}</option>`
    }
    
}

export function changeEventsBackgroundColor(){
    const eventTypes = getEventsTypes();
    const allTask1 = Array.from(document.querySelectorAll('#upcomingEvents .eventType1'));
    for(let i = 0; i < allTask1.length; i++){allTask1[i].style.backgroundColor=eventTypes[0].color;}
    const allTask2 = Array.from(document.querySelectorAll('#upcomingEvents .eventType2'));
    for(let i = 0; i < allTask2.length; i++){allTask2[i].style.backgroundColor=eventTypes[1].color;}
    const allTask3 = Array.from(document.querySelectorAll('#upcomingEvents .eventType3'));
    for(let i = 0; i < allTask3.length; i++){allTask3[i].style.backgroundColor=eventTypes[2].color;}
    const allTask4 = Array.from(document.querySelectorAll('#upcomingEvents .eventType4'));
    for(let i = 0; i < allTask4.length; i++){allTask4[i].style.backgroundColor=eventTypes[3].color;}
    const allTask5 = Array.from(document.querySelectorAll('#upcomingEvents .eventType5'));
    for(let i = 0; i < allTask5.length; i++){allTask5[i].style.backgroundColor=eventTypes[4].color;}
    
}


displayEventTypes();
