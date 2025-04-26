import {getDLEvents, addDLEvent, deleteAllDLEvents} from './deadlineEventService.js'
import { dateToYMD } from './utils.js';

const DLEventsContainerElement = document.getElementById("DLEventsContainer");
const addDLEventBtn = document.getElementById("addDLEvent"); 

const newDLEventBtn = document.getElementById("newDLEvent");
const formElement = document.getElementById("DLEventForm");

newDLEventBtn.addEventListener('click', ()=>{
    formElement.classList.toggle("visible");  
})

export function displayDLEvents(){
    let DLEvents = getDLEvents();
    DLEvents = DLEvents.filter(e => e.archived == false || DLEvents.filter(e => e.completed == false));

    for (let i = 0; i < DLEvents.length; i++) {
        const event = DLEvents[i];
        const checklist = event.checklist || [];
    
        const completedChecklistCount = checklist.filter(item => item.checked).length;
        const totalChecklistCount = checklist.length;

        const checklistHTML = checklist.map(item => `<div><input type="checkbox" ${item.checked}/>${item.title} ${item.completedOn}</div>`).join("");

        
    
        DLEventsContainerElement.innerHTML += `
            <div class="DLevent" id=${event.id}>
                <div class="DLEventHead">
                    <div class="infos">
                        <div class="DLEventTitle">${event.title}</div>
                        <div class="tasksCompleted">${completedChecklistCount}/${totalChecklistCount}</div>
                    </div>
                    <div class="buttons"><button>▼</button></div>
                </div>
                <div class="deadline">by ${event.dueDate}</div>
                <div class="checklist visible">
                    ${checklistHTML}
                    <button class="newTask">add task</button>
                    <button class="completeEvent">mark as complete</button>
                </div>
            </div>`;
    }

}

addDLEventBtn.addEventListener('click', () => {createDLEvent()});

export function createDLEvent(){
    const DLEvents = getDLEvents();
    const eventName = document.getElementById("DLEventName").value;
    const eventDate = document.getElementById("DLEventDay").value;

    let id = "DL-0";
    if(DLEvents.length >= 1){
        const idIndex = DLEvents[DLEvents.length-1].id;
        id = "DL-"+parseInt(idIndex)+1;
    }

    const event = {
        id : "DL-"+DLEvents.length, 
        title : eventName,
        createdAt : dateToYMD(new Date()),
        dueDate : eventDate, 
        checklist : [],
        completed : false, 
        archived : false
    };

    addDLEvent(event);
    displayDLEvents()
}


/*let DLEvents = getDLEvents();
const e ={
    id : "DL-"+DLEvents.length, 
    title : "renew myNumber card",
    createdAt : "2025-04-26",
    dueDate : "2025-06-09", 
    checklist : [{title : "apply online", checked : "", completedOn : ""}, {title : "get documents", checked : "", completedOn : ""}, {title : "go to appointment", checked : "", completedOn : ""}],
    completed : false, 
    archived : false
};*/


//addDLEvent(e);
displayDLEvents();
//deleteAllDLEvents();