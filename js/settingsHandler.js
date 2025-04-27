import { getHabits } from "./habitService.js";
import { getDLEvents } from "./deadlineEventService.js"

import { deleteHabit, editHabitName, editHabitFrequency, archiveHabit } from "./settingsService.js";

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

export function displayDLEventsToEdit(){
    const DLEvents = getDLEvents();

    let DLEventsHTML = "";
    for(let i = 0; i<DLEvents.length;i++){
        const event = DLEvents[i];
        DLEventsHTML+=`<div class="DLEvent" data-id="${event.id}">
            <div class="DLEventTitle">
                <div class="DLEventName">${event.title}</div>
                <div class="buttons"><button class="editDLEvent editBtn">edit.</button><button class="deletDLEvent deleteBtn">x</button></div>
            </div>
            <div class="DLEventDueDate">due ${event.dueDate}</div>
            <div class="DLEventEditPanel">
                            <input class="nameInput" placeholder="deadline new name"/>
                            <input class="frequencyInput" type="date" /><button class="okBtn updatDLEvent">ok</button>
            </div>
        </div>`;
    }
    settingsDLEventsElement.innerHTML+=DLEventsHTML;
}


displayHabitsToEdit();
displayDLEventsToEdit();