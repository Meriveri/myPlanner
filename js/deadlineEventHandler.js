import {getDLEvents, addDLEvent, deleteAllDLEvents} from './deadlineEventService.js'

const DLEventsContainerElement = document.getElementById("DLEventsContainer");

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


let DLEvents = getDLEvents();
const e ={
    id : "DL-"+DLEvents.length, 
    title : "renew myNumber card",
    createdAt : "2025-04-26",
    dueDate : "2025-06-09", 
    checklist : [{title : "apply online", checked : "", completedOn : ""}, {title : "get documents", checked : "", completedOn : ""}, {title : "go to appointment", checked : "", completedOn : ""}],
    completed : false, 
    archived : false
};


//addDLEvent(e);
displayDLEvents();
//deleteAllDLEvents();