import { getHabits } from "./habitService.js";
import { getDLEvents } from "./deadlineEventService.js"

import { deleteHabit, editHabitName, editHabitFrequency, archiveHabit, deleteDLEvent, editDLEventTitle, editDLEventDueDate, editDLEventChecklist, deleteDLEventChecklist} from "./settingsService.js";
import { dateToYMD } from "./utils.js";

const settingsHabitsElement = document.getElementById("settingsHabits");
const settingsDLEventsElement = document.getElementById("settingsDLEvents");

export function showHabitEditPanel(id){
    const editPanels = document.getElementsByClassName("habitEditPanel")
    if(!editPanels[id].classList.contains("visible")){editPanels[id].classList.add("visible");}
    else{editPanels[id].classList.remove("visible");}

}


export function displayHabitsToEdit(){
    const habits = getHabits();
    
    
    let elementHTML = "";
    for(let i = 0; i<habits.length; i++){
        let isActive = habits[i].archived ? "inactive" : "active";
        let invertOfArchiveStatus = habits[i].archived ? "unarchive" : "archive";
        
        elementHTML+=`<div class="habit" data-id="${habits[i].id}">
            <div class="habitTitle">
                <div class="habitName">${habits[i].name}</div>
                <div class="buttons"><button class="archiveHabit switchto${isActive}Btn">${invertOfArchiveStatus}</button><button class="editHabit editBtn">edit.</button><button class="deleteHabit deleteBtn">x</button></div>
            </div>
            <div class="habitFrequency">every ${habits[i].frequency.value} day(s) | ${isActive}</div>
            <div class="habitEditPanel">
                            <input class="nameInput" placeholder="new habit name"/>
                            <input class="frequencyInput" type="number" placeholder="every x days"/><button class="okBtn updateHabit">ok</button>
            </div>
        </div>`;
        
    }
    settingsHabitsElement.innerHTML = elementHTML;
}

settingsHabitsElement.addEventListener('click', (btn) =>{
    const id = btn.target.parentElement.parentElement.parentElement.dataset.id;

    if(btn.target.classList.contains("deleteHabit")){
        const clickedHabit = btn.target.closest(".habit");
        const allHabits = Array.from(settingsHabitsElement.querySelectorAll(".habit"));
        const indexOfHabit = allHabits.indexOf(clickedHabit);
    
        deleteHabit(id, indexOfHabit);
        displayHabitsToEdit();
    }
    if(btn.target.classList.contains("editHabit")){
        const clickedHabit = btn.target.closest(".habit");
        const allHabits = Array.from(settingsHabitsElement.querySelectorAll(".habit"));
        const indexOfHabit = allHabits.indexOf(clickedHabit);
        showHabitEditPanel(indexOfHabit);
    }

    if(btn.target.classList.contains("updateHabit")){
    const id = btn.target.parentElement.parentElement.dataset.id;
    const clickedHabit = btn.target.closest(".habit");
    const allHabits = Array.from(settingsHabitsElement.querySelectorAll(".habit"));
    const indexOfHabit = allHabits.indexOf(clickedHabit);

    const name = document.getElementsByClassName("nameInput")[indexOfHabit].value;
    const frequency = document.getElementsByClassName("frequencyInput")[indexOfHabit].value;


    editHabitName(id, name);
    editHabitFrequency(id, frequency);
    displayHabitsToEdit();
    }

    if(btn.target.classList.contains("archiveHabit")){
        const id = btn.target.parentElement.parentElement.parentElement.dataset.id;
        archiveHabit(id);
        displayHabitsToEdit();
    }
})


//display DLEvent
export function displayDLEventsToEdit(){
    const DLEvents = getDLEvents();

    let DLEventsHTML = "";
    for(let i = 0; i<DLEvents.length;i++){
        const event = DLEvents[i];
        let checklistHTML = "";
        for(let i = 0; i<event.checklist.length;i++){
            checklistHTML += `
                <div class="task" data-index="${i}">
                    <input type="text" placeholder="${event.checklist[i].title}"  class="taskTitleInput"/>
                    <div class="buttons">
                        <button class="okBtn editChecklist" type="submit">ok</button>
                        <button class="deleteBtn deleteChecklist">x</button>
                    </div>
                </div>`;
        }
        DLEventsHTML+=`<div class="DLEvent" data-id="${event.id}">
            <div class="DLEventTitle">
                <div class="DLEventName">${event.title}</div>
                <div class="buttons"><button class="editDLEvent editBtn">edit.</button><button class="deleteDLEvent deleteBtn">x</button></div>
            </div>
            <div class="DLEventDueDate">due ${event.dueDate}</div>
            <div class="DLEventEditPanel">
                         <div class="DLInfos">   
                            <input class="titleInput" placeholder="deadline new name"/>
                            <input class="dueDateInput" type="date" /><button class="okBtn updateDLEvent">ok</button>
                        </div>
                        <div class="DLEventChecklistInfos">${checklistHTML}</div>
            </div>
        </div>`;
    }
    settingsDLEventsElement.innerHTML=DLEventsHTML;
}

//delete DLEvent
settingsDLEventsElement.addEventListener('click', (btn)=>{
    if(btn.target.classList.contains("deleteDLEvent")){
        const id = btn.target.parentElement.parentElement.parentElement.dataset.id;
        const clickedDLEvent = btn.target.closest(".DLEvent");
        const allDLEvents = Array.from(settingsDLEventsElement.querySelectorAll(".DLEvent"));
        const index = allDLEvents.indexOf(clickedDLEvent);
        
        deleteDLEvent(id, index);
        displayDLEventsToEdit();
    }
    
});

//get appropriate DLEvent to show its settings
settingsDLEventsElement.addEventListener('click', (btn)=>{
    if(btn.target.classList.contains("editDLEvent")){
        const clickedDLEvent = btn.target.closest(".DLEvent");
        const allDLEvents = Array.from(settingsDLEventsElement.querySelectorAll(".DLEvent"));
        const indexOfDLEvent = allDLEvents.indexOf(clickedDLEvent);
        showDLEventEditPanel(indexOfDLEvent);
    }
    
});

//deadline change title and due date
settingsDLEventsElement.addEventListener('click', (btn)=>  {
    if(btn.target.classList.contains("updateDLEvent")){
    const id = btn.target.parentElement.parentElement.parentElement.dataset.id;
    const clickeDLEvent = btn.target.closest(".DLEvent");
    const allDLEvents = Array.from(settingsDLEventsElement.querySelectorAll(".DLEvent"));
    const indexOfDLEvent = allDLEvents.indexOf(clickeDLEvent);

    const title = document.getElementsByClassName("titleInput")[indexOfDLEvent].value;
    let dueDate = document.getElementsByClassName("dueDateInput")[indexOfDLEvent].value;
    dueDate = dateToYMD(dueDate);

    editDLEventTitle(id, title);
    editDLEventDueDate(id, dueDate);
    displayDLEventsToEdit();
    }
});

settingsDLEventsElement.addEventListener('click', (btn) =>{
        const DLEventID = btn.target.closest(".DLEvent").dataset.id;
        


    if(btn.target.classList.contains("editChecklist")){
        const clickedTaskInEvent = btn.target.closest("div").parentElement;
        const indexOfTask = clickedTaskInEvent.dataset.index;
        
        const name =clickedTaskInEvent.querySelector(".taskTitleInput").value;

        if(name!=""){editDLEventChecklist(DLEventID, indexOfTask, name); displayDLEventsToEdit();}
        else{
            clickedTaskInEvent.querySelector(".taskTitleInput").classList.remove("invalidField");
            clickedTaskInEvent.querySelector(".taskTitleInput").classList.add("invalidField");
        }
        
        
    }

    if(btn.target.classList.contains("deleteChecklist")){
        const clickedTaskInEvent = btn.target.closest("div").parentElement;
        const indexOfTask = clickedTaskInEvent.dataset.index;

        deleteDLEventChecklist(DLEventID, indexOfTask);
        displayDLEventsToEdit();
    }

});


export function showDLEventEditPanel(id){
    const editPanels = document.getElementsByClassName("DLEventEditPanel")
    if(!editPanels[id].classList.contains("visible")){editPanels[id].classList.add("visible");}
    else{editPanels[id].classList.remove("visible");}

}

displayHabitsToEdit();
displayDLEventsToEdit();