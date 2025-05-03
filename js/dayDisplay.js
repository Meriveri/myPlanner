import { deleteEventById, getEvents, addEvent, getEventsByDate, addCompletedEvent, getCompletedEvents } from './eventService.js';  
import { showEvents } from './eventsHandler.js';
import { putDaysWithEventsInBold } from './main.js';
import { getEventsTypes } from './eventService.js';
import { dateToYMD } from './utils.js';

const pageElement = document.getElementById("dayPage");
const pageDateElement = document.getElementById("pageDate");
const dayEventsContainerElement = document.getElementById("dayEventsContainer");
const calendarElement = document.getElementById("dates");
const completeBtn = document.getElementById("dayEventsContainer");

let day = new Date();
let events = getEventsByDate(day);

const renderOnSelect = () =>{
    calendarElement.addEventListener("click", (e) =>{
        const clickedDate = new Date(Date.parse(e.target.dataset.date));
        day = clickedDate;
        events = getEventsByDate(day);
        if(clickedDate!="Invalid Date"){renderPage(clickedDate,events);}
    })
}

const displaySelectedDay = (day) => {
    if(dateToYMD(day) != "0000-01-01") {
        const display = day.toLocaleDateString('default', {weekday: 'long', day: 'numeric', month:'long', year: 'numeric'}); 
        pageDateElement.innerHTML = `${display}`;
    }

}
const displayEvents = (events) =>{
    let eventsHTML = ""; 
    events = events.filter(e => e.date != "0000-01-01");
    if(events.length==0){eventsHTML=`<div class="event">no event today.</div>`;}
    else{
        for(let i=0; i<events.length;i++){
            eventsHTML+=`<div class="event ${events[i].type}">${events[i].time} ${events[i].name} <button class="completeEvent okBtn" data-id="${events[i].id}">✔</button></div>`;
        }
    }
    dayEventsContainerElement.innerHTML = eventsHTML;
}
export function renderPage (day, events){
    displaySelectedDay(day);
    displayEvents(events);
    changeEventsColor();
}

//remove Event from list when completed from display page
completeBtn.addEventListener('click', (btn)=>{
    if(btn.target.classList.contains("completeEvent")){
        let events = getEvents();
        const id = btn.target.dataset.id;
        const event = events.filter(event => event.id == id)[0];
        addCompletedEvent(event);
        showEvents();
        putDaysWithEventsInBold();
        renderPage(new Date(), events);
        console.log("archived ", getCompletedEvents())
    }
})

export function changeEventsColor(){
    const eventTypes = getEventsTypes();
    const allTask1 = Array.from(document.querySelectorAll('#dayEventsContainer .eventType1'));
    for(let i = 0; i < allTask1.length; i++){allTask1[i].style.color=eventTypes[0].color;}
    const allTask2 = Array.from(document.querySelectorAll('#dayEventsContainer .eventType2'));
    for(let i = 0; i < allTask2.length; i++){allTask2[i].style.color=eventTypes[1].color;}
    const allTask3 = Array.from(document.querySelectorAll('#dayEventsContainer .eventType3'));
    for(let i = 0; i < allTask3.length; i++){allTask3[i].style.color=eventTypes[2].color;}
    const allTask4 = Array.from(document.querySelectorAll('#dayEventsContainer .eventType4'));
    for(let i = 0; i < allTask4.length; i++){allTask4[i].style.color=eventTypes[3].color;}
    const allTask5 = Array.from(document.querySelectorAll('#dayEventsContainer .eventType5'));
    for(let i = 0; i < allTask5.length; i++){allTask5[i].style.color=eventTypes[4].color;}
}

renderPage(day, events);
renderOnSelect();