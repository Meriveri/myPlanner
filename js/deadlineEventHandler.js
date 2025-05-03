import {getDLEvents, addDLEvent, addTaskToDLEvent, updateTask, completeDLEvent} from './deadlineEventService.js'
import { addXDaysToDate, dateToYMD, pastXDays } from './utils.js';
import { updatePoints } from './gatchaService.js';
import { displayPoints } from './gatchaHandler.js';

const DLEventsContainerElement = document.getElementById("DLEventsContainer");
const addDLEventBtn = document.getElementById("addDLEvent"); 

const newDLEventBtn = document.getElementById("newDLEvent");
const formElement = document.getElementById("DLEventForm");

DLEventsContainerElement.addEventListener('click', (btn) =>{
    if(btn.target.classList.contains("newTask")){
        const id = btn.target.parentElement.parentElement.parentElement.dataset.id;
        console.log(id);
        const taskName = btn.target.parentElement.querySelector(".taskInput").value;
        
        if(taskName!=""){addTaskToDLEvent(id, taskName); displayDLEvents();}
        else{
            btn.target.parentElement.querySelector(".taskInput").classList.remove("invalidField");
            btn.target.parentElement.querySelector(".taskInput").classList.add("invalidField");
        }
        
    }

});

DLEventsContainerElement.addEventListener('click', (btn) =>{
    if(btn.target.classList.contains("completeEvent")){
        const id = btn.target.parentElement.parentElement.dataset.id;
        completeDLEvent(id);
        updatePoints(20);
        displayPoints();
        displayDLEvents();
    }

});

DLEventsContainerElement.addEventListener('change', (box) => {
    if (box.target.matches('input[type="checkbox"]')) {
        const eventElement = box.target.closest('.DLevent');
        const eventId = eventElement.dataset.id;
        
        const checklistDiv = box.target.closest('.checklist');
        const checkboxes = checklistDiv.querySelectorAll('input[type="checkbox"]');
        
        const index = Array.from(checkboxes).indexOf(box.target);

        if(box.target.checked){updatePoints(5); displayPoints();}
        else{updatePoints(-5); displayPoints();}

        updateTask(eventId, index, box.target.checked);
        displayDLEvents();
    }
});

DLEventsContainerElement.addEventListener('mouseover', (i)=>{
    if(i.target.classList.contains("taskInput")){i.target.placeholder="";}
});

DLEventsContainerElement.addEventListener('mouseout', (i)=>{
    if(i.target.classList.contains("taskInput")){i.target.placeholder="new task name";}
});

newDLEventBtn.addEventListener('click', ()=>{
    formElement.classList.toggle("visible");  
})

DLEventsContainerElement.addEventListener('click', (btn) => {
    if(btn.target.classList.contains("dropdown")){
        const DLEvent = btn.target.closest(".DLEvent");
        const checklist = DLEvent.querySelector(".checklist");
        checklist.classList.toggle("visible");
        if(checklist.classList.contains("visible")){btn.target.style.transform="rotate(0deg)"}
        else{btn.target.style.transform="rotate(180deg)";}
            
    }
});


export function displayDLEvents(){
    let DLEvents = getDLEvents();
    DLEvents = DLEvents.filter(e => !e.archived && !e.completed);
    DLEventsContainerElement.innerHTML = "";

    for (let i = 0; i < DLEvents.length; i++) {
        const event = DLEvents[i];
        const checklist = event.checklist || [];
    
        const completedChecklistCount = checklist.filter(item => item.checked).length;
        const totalChecklistCount = checklist.length;

        const checklistHTML = checklist.map(item => `<div class="task"><input type="checkbox" ${item.checked}/>${item.title} ${item.completedOn}</div>`).join("");

        let dueDateColor = "";
        let dueDateIndicator = "";

        if(event.dueDate==dateToYMD(new Date())){
            dueDateColor = "today";
            dueDateIndicator=`<div class="borderBubble">today</div>`;

        }

        const prevWeek = pastXDays(event.dueDate, 7);
        if(prevWeek.includes(dateToYMD(new Date()))){
            dueDateColor = "thisWeek";
            dueDateIndicator=`<div class="borderBubble">this week</div>`;
            
        }

        if(event.dueDate < dateToYMD(new Date())){
            dueDateColor = "missed";
            dueDateIndicator=`<div class="borderBubble">missed</div>`;
        }
    
        DLEventsContainerElement.innerHTML += `
            <div class="DLevent ${dueDateColor}" data-id=${event.id}>
                <div class="DLEventHead">
                    <div class="infos">
                        <div class="DLEventTitle">${event.title} </div> 
                        <div class="tasksCompleted">${completedChecklistCount}/${totalChecklistCount} </div>${dueDateIndicator}
                    </div>
                    <div class="buttons"><button class="dropdown">▲</button></div>
                </div>
                <div class="deadline">by ${event.dueDate}</div>
                <div class="checklist visible">
                    ${checklistHTML}
                    <div class="addTask">
                        <input class="taskInput" placeholder="new task name"/>
                        <button class="newTask"><i class="fa-solid fa-plus"></i></button>
                        
                    </div>
                    <button class="completeEvent">mark deadline as complete</button>
                </div>
            </div>`;
    }

}

addDLEventBtn.addEventListener('click', () => {createDLEvent()});

export function createDLEvent(){
    const DLEvents = getDLEvents();
    const eventName = document.getElementById("DLEventName").value;
    const eventDate = document.getElementById("DLEventDay").value;

    if(eventName != "" && dateToYMD(eventDate)!="Invalid Date"){
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
        }
        addDLEvent(event);
        displayDLEvents();

        
    }
    else{
        document.getElementById("DLEventName").classList.remove("invalidField");
        document.getElementById("DLEventDay").classList.remove("invalidField");
        if(eventName == ""){document.getElementById("DLEventName").classList.add("invalidField");}
        if(dateToYMD(eventDate)=="Invalid Date"){document.getElementById("DLEventDay").classList.add("invalidField");}


    }
    
}


displayDLEvents();