import { getHabits } from "./habitService.js";
import { getDLEvents } from "./deadlineEventService.js"
import { updateEventsTypeName, updateEventsTypeColor, getEventsTypes } from "./eventService.js";

import { deleteHabit, editHabitName, editHabitFrequency, archiveHabit, deleteDLEvent, editDLEventTitle, editDLEventDueDate, editDLEventChecklist, deleteDLEventChecklist} from "./settingsService.js";
import { dateToYMD } from "./utils.js";

const settingsHabitsElement = document.getElementById("settingsHabits");
const settingsDLEventsElement = document.getElementById("settingsDLEvents");
const settingsEventsElement = document.getElementById("settingsEvents")

const generalTabBtn = document.getElementById("generalSettings");
const eventsTabBtn = document.getElementById("eventsSettings");
const habitsTabBtn = document.getElementById("habitsSettings");
const DLEventsTabBtn = document.getElementById("DLEventsSettings");

export function showHabitEditPanel(id){
    const editPanels = document.getElementsByClassName("habitEditPanel")
    if(!editPanels[id].classList.contains("visible")){editPanels[id].classList.add("visible");}
    else{editPanels[id].classList.remove("visible");}

}

habitsTabBtn.addEventListener('click', () =>{
    settingsDLEventsElement.innerHTML=""; 
    settingsEventsElement.innerHTML="";

    habitsTabBtn.style.backgroundColor="yellowGreen";

    generalTabBtn.style.backgroundColor="white";
    DLEventsTabBtn.style.backgroundColor="white";  
    displayHabitsToEdit();
});

DLEventsTabBtn.addEventListener('click', () =>{
    settingsHabitsElement.innerHTML="";
    settingsEventsElement.innerHTML="";

    DLEventsTabBtn.style.backgroundColor="yellowGreen";

    generalTabBtn.style.backgroundColor="white";
    eventsTabBtn.style.backgroundColor="white";
    habitsTabBtn.style.backgroundColor="white";
    displayDLEventsToEdit();
});

generalTabBtn.addEventListener('click', () =>{
    settingsHabitsElement.innerHTML="";
    settingsDLEventsElement.innerHTML=""; 
    settingsEventsElement.innerHTML="";

    generalTabBtn.style.backgroundColor="yellowGreen";

    eventsTabBtn.style.backgroundColor="white";
    habitsTabBtn.style.backgroundColor="white";
    DLEventsTabBtn.style.backgroundColor="white";
});

eventsTabBtn.addEventListener('click', () =>{
    settingsHabitsElement.innerHTML="";
    settingsDLEventsElement.innerHTML=""; 

    eventsTabBtn.style.backgroundColor="yellowGreen";
    
    generalTabBtn.style.backgroundColor="white";
    habitsTabBtn.style.backgroundColor="white";
    DLEventsTabBtn.style.backgroundColor="white";

    displayEventsTypeEditor();
});

export function displayHabitsToEdit(){
    const habits = getHabits();
    
    
    let elementHTML = "";
    for(let i = 0; i<habits.length; i++){
        let isActive = habits[i].archived ? "inactive" : "active";
        let invertOfArchiveStatus = habits[i].archived ? `<i class="fa-solid fa-lock-open"></i>` : `<i class="fa-solid fa-lock"></i>`;
        
        elementHTML+=`<div class="habit" data-id="${habits[i].id}">
            <div class="habitTitle">
                <div class="habitName">${habits[i].name}</div>
                <div class="buttons"><button class="archiveHabit switchto${isActive}Btn">${invertOfArchiveStatus}</button><button class="editHabit editBtn"><i class="fa-solid fa-pen-to-square"></i></button><button class="deleteHabit deleteBtn"><i class="fa-solid fa-trash"></i></button></div>
            </div>
            <div class="habitFrequency">every ${habits[i].frequency.period} day(s) | ${isActive}</div>
            <div class="habitEditPanel">
                            <input class="nameInput" placeholder="new habit name"/>
                            <input class="periodInput" type="number" placeholder="every x days"/><button class="okBtn updateHabit"><i class="fa-solid fa-check"></i></button>
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
    const frequency = parseInt(document.getElementsByClassName("periodInput")[indexOfHabit].value);

    if (Number.isInteger(frequency) && name !=""){
        clickedHabit.querySelector(".periodInput").classList.remove("invalidField");
        clickedHabit.querySelector(".nameInput").classList.remove("invalidField"); 
        if(Number.isInteger(frequency)){ 
        editHabitFrequency(id, frequency); 
        displayHabitsToEdit();
        }
        if(name!=""){
            editHabitName(id, name); 
            displayHabitsToEdit(); 
        }
    }
    else{
        clickedHabit.querySelector(".nameInput").classList.remove("invalidField"); 
        clickedHabit.querySelector(".periodInput").classList.remove("invalidField"); 
        if(name==""){
            clickedHabit.querySelector(".nameInput").classList.add("invalidField");
        }
        if(!Number.isInteger(frequency)){
            clickedHabit.querySelector(".periodInput").classList.add("invalidField");
        }
    }
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
                        <button class="okBtn editChecklist" type="submit"><i class="fa-solid fa-check"></i></button>
                        <button class="deleteBtn deleteChecklist"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>`;
        }
        DLEventsHTML+=`<div class="DLEvent" data-id="${event.id}">
            <div class="DLEventTitle">
                <div class="DLEventName">${event.title}</div>
                <div class="buttons"><button class="editDLEvent editBtn"><i class="fa-solid fa-pen-to-square"></i></button><button class="deleteDLEvent deleteBtn"><i class="fa-solid fa-trash"></i></button></div>
            </div>
            <div class="DLEventDueDate">due ${event.dueDate}</div>
            <div class="DLEventEditPanel">
                         <div class="DLInfos">   
                            <input class="titleInput" placeholder="deadline new name"/>
                            <input class="dueDateInput" type="date" /><button class="okBtn updateDLEvent"><i class="fa-solid fa-check"></i></button>
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

    if(title != "" && dueDate != "Invalid Date"){
        clickeDLEvent.querySelector(".titleInput").classList.remove("invalidField");
        clickeDLEvent.querySelector(".dueDateInput").classList.remove("invalidField");

        editDLEventTitle(id, title);
        editDLEventDueDate(id, dueDate);
        displayDLEventsToEdit();
    }
    else{
        clickeDLEvent.querySelector(".titleInput").classList.remove("invalidField");
        clickeDLEvent.querySelector(".dueDateInput").classList.remove("invalidField");
        if(title==""){clickeDLEvent.querySelector(".titleInput").classList.add("invalidField");}
        if(dueDate == "Invalid Date"){clickeDLEvent.querySelector(".dueDateInput").classList.add("invalidField");}
    }

    
    }
});

settingsDLEventsElement.addEventListener('click', (btn) =>{
        const DLEventID = btn.target.closest(".DLEvent").dataset.id;
        


    if(btn.target.classList.contains("editChecklist")){
        const clickedTaskInEvent = btn.target.closest("div").parentElement;
        const indexOfTask = clickedTaskInEvent.dataset.index;
        
        const name =clickedTaskInEvent.querySelector(".taskTitleInput").value;

        if(name!=""){clickedTaskInEvent.querySelector(".taskTitleInput").classList.remove("invalidField"); editDLEventChecklist(DLEventID, indexOfTask, name); displayDLEventsToEdit();}
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

export function displayEventsTypeEditor(){
    const eventTypes = getEventsTypes();
    settingsEventsElement.innerHTML=`<div class="eventsTypeForm" id="eventTypeForm">`
    for(let i = 0; i < eventTypes.length;i++){
        settingsEventsElement.innerHTML+=`
        <div class="eventsTypeForm" id="eventTypeForm">
            <div class="eventType">
                <div class="renameType">
                    <input type="text" data-eventType="${i}" value = "${eventTypes[i].name} "placeholder="rename ${eventTypes[i].name}"/><button class="nameEventType okBtn">rename</button>
                </div>
                <div class="recolorType">
                    <input type="color" data-eventType="${i}" value="${eventTypes[i].color}"/><button class="colorEventType okBtn">set colour</button>
                </div>
        </div>`;
    }
    settingsDLEventsElement.innerHTML+=`</div>`

}

settingsEventsElement.addEventListener('click', (btn) =>{
    if(btn.target.classList.contains("nameEventType")){
        const clickedEventType = btn.target.parentElement.querySelector("input");
        const index = clickedEventType.dataset.eventtype;
        const name = clickedEventType.value;

        updateEventsTypeName(index, name);

    }

    if(btn.target.classList.contains("colorEventType")){
        const clickedEventType = btn.target.parentElement.querySelector("input");
        const index = clickedEventType.dataset.eventtype;
        const color = clickedEventType.value;
        console.log(clickedEventType.value);

        updateEventsTypeColor(index, color);

    }

});
//displayHabitsToEdit();
//displayDLEventsToEdit();