import { deleteEventById, getEvents, addEvent, getEventsByDate, addCompletedEvent, getCompletedEvents } from './eventService.js';  
import { showEvents } from './eventsHandler.js';
import { putDaysWithEventsInBold } from './main.js';

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
    const display = day.toLocaleDateString('default', {weekday: 'long', day: 'numeric', month:'long', year: 'numeric'});
    pageDateElement.innerHTML = `${display}`;

}
const displayEvents = (events) =>{
    let eventsHTML = ""; 
    if(events.length==0){eventsHTML=`<div class="event">pas d'évènement aujourd'hui.</div>`;}
    else{
        for(let i=0; i<events.length;i++){
            eventsHTML+=`<div class="event ${events[i].type}">${events[i].time} ${events[i].name} <button class="completeEvent okBtn" data-id="${events[i].id}">ok</button></div>`;
        }
    }
    dayEventsContainerElement.innerHTML = eventsHTML;
}
export function renderPage (day, events){
    displaySelectedDay(day);
    displayEvents(events);
}

//remove Event from list when completed from display page
completeBtn.addEventListener('click', (btn)=>{
    if(btn.target.classList.contains("completeEvent")){
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

renderPage(day, events);
renderOnSelect();